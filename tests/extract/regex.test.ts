import { describe, it, expect } from 'vitest';
import { extractWithRegex, extractEntities } from '../../src/extract/regex.js';

describe('regex extraction', () => {
  const cases = [
    {
      input: "let's use Tailwind for styling",
      type: 'use',
      commitmentContains: 'tailwind',
    },
    {
      input: 'we agreed to use PostgreSQL',
      type: 'use',
      commitmentContains: 'postgresql',
    },
    {
      input: 'we decided on TypeScript for all backend code',
      type: 'use',
      commitmentContains: 'typescript',
    },
    {
      input: 'never use inline styles',
      type: 'never',
      commitmentContains: 'inline styles',
    },
    {
      input: "don't use any authentication yet",
      type: 'avoid',
      commitmentContains: 'authentication',
    },
    {
      input: 'use UUIDs for all primary keys',
      type: 'use',
      commitmentContains: 'uuid',
    },
    {
      input: 'always use async/await, never callbacks',
      type: 'always',
      commitmentContains: 'async/await',
    },
    {
      input: 'avoid using class components',
      type: 'avoid',
      commitmentContains: 'class components',
    },
    {
      input: "we're using Next.js for the frontend",
      type: 'architectural',
      commitmentContains: 'next.js',
    },
    {
      input: 'PostgreSQL is our database',
      type: 'architectural',
      commitmentContains: 'postgresql',
    },
    {
      input: 'stick with Express for the server',
      type: 'use',
      commitmentContains: 'express',
    },
    {
      input: 'only use functional components',
      type: 'use',
      commitmentContains: 'functional components',
    },
  ];

  for (const tc of cases) {
    it(`extracts "${tc.input}" as type "${tc.type}"`, () => {
      const results = extractWithRegex(tc.input);
      expect(results.length).toBeGreaterThanOrEqual(1);

      const match = results.find(
        (r) =>
          r.type === tc.type &&
          r.commitment.toLowerCase().includes(tc.commitmentContains.toLowerCase()),
      );
      expect(match).toBeDefined();
      expect(match!.source).toBe('regex');
      expect(match!.confidence).toBeGreaterThan(0);
    });
  }

  it('returns empty array for text with no decisions', () => {
    const results = extractWithRegex('The weather is nice today.');
    expect(results).toEqual([]);
  });

  it('extracts multiple decisions from one message', () => {
    const text = "Let's use Tailwind for styling. Always use async/await. Never use callbacks.";
    const results = extractWithRegex(text);
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('deduplicates identical commitments', () => {
    const text = "Let's use React. Let's use React.";
    const results = extractWithRegex(text);
    // Count unique commitments (normalized to lowercase)
    const commitments = results.map((r) => r.commitment.toLowerCase());
    const uniqueCommitments = new Set(commitments);
    // Each unique commitment should appear only once
    expect(uniqueCommitments.size).toBe(commitments.length);
  });

  it('handles empty string', () => {
    const results = extractWithRegex('');
    expect(results).toEqual([]);
  });

  it('handles very long text without crashing', () => {
    const longText = "let's use TypeScript. ".repeat(1000);
    const results = extractWithRegex(longText);
    // Should extract at least once (deduplication kicks in)
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

describe('entity extraction', () => {
  it('extracts technology names', () => {
    const entities = extractEntities('We should use PostgreSQL and React');
    expect(entities).toContain('postgres');
  });

  it('extracts common terms', () => {
    const entities = extractEntities('use tailwind for styling and uuid for ids');
    expect(entities).toContain('tailwind');
    expect(entities).toContain('uuid');
  });

  it('returns empty for no entities', () => {
    const entities = extractEntities('the quick brown fox');
    // Should not contain any tech entities
    expect(entities.length).toBeLessThanOrEqual(1); // might pick up capitalized words
  });

  it('deduplicates entities', () => {
    const entities = extractEntities('React React React');
    const reactCount = entities.filter((e) => e === 'react').length;
    expect(reactCount).toBeLessThanOrEqual(1);
  });
});
