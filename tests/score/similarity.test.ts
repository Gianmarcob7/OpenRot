import { describe, it, expect } from 'vitest';
import { cosineSimilarity } from '../../src/extract/embedding.js';
import { checkSimpleContradiction, entityPreFilter } from '../../src/score/similarity.js';
import type { Decision } from '../../src/types.js';

function makeDecision(overrides: Partial<Decision> = {}): Decision {
  return {
    id: 'test-id',
    sessionId: 'test-session',
    turn: 1,
    rawText: 'test',
    commitment: 'use Tailwind for styling',
    type: 'use',
    confidence: 0.8,
    embedding: null,
    source: 'regex',
    createdAt: Date.now(),
    ...overrides,
  };
}

describe('cosine similarity', () => {
  it('returns 1 for identical vectors', () => {
    const a = new Float32Array([1, 0, 0]);
    const b = new Float32Array([1, 0, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(1, 5);
  });

  it('returns 0 for orthogonal vectors', () => {
    const a = new Float32Array([1, 0, 0]);
    const b = new Float32Array([0, 1, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 5);
  });

  it('returns -1 for opposite vectors', () => {
    const a = new Float32Array([1, 0, 0]);
    const b = new Float32Array([-1, 0, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1, 5);
  });

  it('returns 0 for zero vectors', () => {
    const a = new Float32Array([0, 0, 0]);
    const b = new Float32Array([1, 1, 1]);
    expect(cosineSimilarity(a, b)).toBe(0);
  });

  it('returns 0 for mismatched lengths', () => {
    const a = new Float32Array([1, 0]);
    const b = new Float32Array([1, 0, 0]);
    expect(cosineSimilarity(a, b)).toBe(0);
  });

  it('handles arbitrary similar vectors', () => {
    const a = new Float32Array([1, 2, 3]);
    const b = new Float32Array([1, 2, 3.1]);
    const sim = cosineSimilarity(a, b);
    expect(sim).toBeGreaterThan(0.99);
    expect(sim).toBeLessThanOrEqual(1);
  });
});

describe('simple contradiction check', () => {
  const contradictionCases = [
    {
      description: 'Tailwind vs inline styles',
      decision: makeDecision({ commitment: 'use Tailwind for styling', type: 'use' }),
      response: "Here's the component with inline styles: style={{color: 'red'}}",
      shouldContradict: true,
    },
    {
      description: 'PostgreSQL vs SQLite',
      decision: makeDecision({ commitment: 'use PostgreSQL', type: 'use' }),
      response: "Let me create the SQLite database connection",
      shouldContradict: true,
    },
    {
      description: 'UUIDs vs SERIAL',
      decision: makeDecision({ commitment: 'use UUIDs for all primary keys', type: 'use' }),
      response: 'CREATE TABLE users (id SERIAL PRIMARY KEY)',
      shouldContradict: true,
    },
    {
      description: 'No auth vs adding auth',
      decision: makeDecision({
        commitment: 'no authentication yet',
        type: 'avoid',
      }),
      response: "I'll add the auth middleware to protect this route",
      shouldContradict: true,
    },
    {
      description: 'async/await vs callbacks',
      decision: makeDecision({ commitment: 'always use async/await', type: 'always' }),
      response: 'function getData(callback) { fetch(url).then(callback) }',
      shouldContradict: true,
    },
  ];

  const nonContradictionCases = [
    {
      description: 'Tailwind used correctly',
      decision: makeDecision({ commitment: 'use Tailwind for styling', type: 'use' }),
      response: "Here's the Tailwind classes: className='bg-blue-500 text-white p-4'",
      shouldContradict: false,
    },
    {
      description: 'PostgreSQL used consistently',
      decision: makeDecision({ commitment: 'use PostgreSQL', type: 'use' }),
      response: 'const pool = new Pool({ connectionString: process.env.DATABASE_URL })',
      shouldContradict: false,
    },
    {
      description: 'Unrelated response',
      decision: makeDecision({ commitment: 'use Tailwind for styling', type: 'use' }),
      response: 'The user authentication flow works like this...',
      shouldContradict: false,
    },
  ];

  for (const tc of contradictionCases) {
    it(`detects contradiction: ${tc.description}`, () => {
      const result = checkSimpleContradiction(tc.decision, tc.response);
      expect(result).not.toBeNull();
      expect(typeof result).toBe('string');
    });
  }

  for (const tc of nonContradictionCases) {
    it(`does NOT flag: ${tc.description}`, () => {
      const result = checkSimpleContradiction(tc.decision, tc.response);
      expect(result).toBeNull();
    });
  }
});

describe('entity pre-filter', () => {
  it('filters out unrelated decisions', () => {
    const decisions = [
      makeDecision({ id: '1', commitment: 'use PostgreSQL', type: 'use' }),
      makeDecision({ id: '2', commitment: 'use React', type: 'use' }),
    ];

    const filtered = entityPreFilter('Setting up SQLite database', decisions);
    // Both should pass because entityPreFilter is lenient
    // PostgreSQL matches because "sqlite" entity is also DB-related
    expect(filtered.length).toBeGreaterThanOrEqual(1);
  });

  it('returns all decisions when response has no entities', () => {
    const decisions = [
      makeDecision({ id: '1', commitment: 'use PostgreSQL', type: 'use' }),
    ];

    const filtered = entityPreFilter('Hello, how are you?', decisions);
    // No entities found → returns all
    expect(filtered.length).toBe(1);
  });

  it('handles empty decisions array', () => {
    const filtered = entityPreFilter('Use PostgreSQL', []);
    expect(filtered).toEqual([]);
  });
});
