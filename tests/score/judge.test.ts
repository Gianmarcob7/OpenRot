import { describe, it, expect, vi } from 'vitest';
import { judgeContradiction } from '../../src/score/judge.js';
import type { Decision, ModelClient } from '../../src/types.js';

function makeDecision(overrides: Partial<Decision> = {}): Decision {
  return {
    id: 'test-id',
    sessionId: 'test-session',
    turn: 1,
    rawText: 'test',
    commitment: 'use PostgreSQL',
    type: 'use',
    confidence: 0.8,
    embedding: null,
    source: 'regex',
    createdAt: Date.now(),
    ...overrides,
  };
}

describe('LLM judge', () => {
  it('detects contradiction from valid response', async () => {
    const client: ModelClient = {
      complete: vi.fn().mockResolvedValue(
        JSON.stringify({
          contradicts: true,
          confidence: 0.9,
          reason: 'Response uses MySQL instead of PostgreSQL',
        }),
      ),
    };

    const result = await judgeContradiction(
      makeDecision(),
      'Setting up the MySQL connection pool',
      client,
    );

    expect(result).not.toBeNull();
    expect(result!.contradicts).toBe(true);
    expect(result!.confidence).toBe(0.9);
    expect(result!.reason).toContain('MySQL');
  });

  it('returns no contradiction when response is consistent', async () => {
    const client: ModelClient = {
      complete: vi.fn().mockResolvedValue(
        JSON.stringify({
          contradicts: false,
          confidence: 0.1,
          reason: 'Response is consistent with using PostgreSQL',
        }),
      ),
    };

    const result = await judgeContradiction(
      makeDecision(),
      'Configuring the PostgreSQL connection pool',
      client,
    );

    expect(result).not.toBeNull();
    expect(result!.contradicts).toBe(false);
  });

  it('handles markdown-wrapped JSON', async () => {
    const client: ModelClient = {
      complete: vi.fn().mockResolvedValue(
        '```json\n{"contradicts": true, "confidence": 0.85, "reason": "test"}\n```',
      ),
    };

    const result = await judgeContradiction(makeDecision(), 'test', client);
    expect(result).not.toBeNull();
    expect(result!.contradicts).toBe(true);
  });

  it('returns null on invalid JSON', async () => {
    const client: ModelClient = {
      complete: vi.fn().mockResolvedValue('not json'),
    };

    const result = await judgeContradiction(makeDecision(), 'test', client);
    expect(result).toBeNull();
  });

  it('returns null when client throws', async () => {
    const client: ModelClient = {
      complete: vi.fn().mockRejectedValue(new Error('Network error')),
    };

    const result = await judgeContradiction(makeDecision(), 'test', client);
    expect(result).toBeNull();
  });

  it('clamps confidence to [0, 1]', async () => {
    const client: ModelClient = {
      complete: vi.fn().mockResolvedValue(
        JSON.stringify({ contradicts: true, confidence: 1.5, reason: 'test' }),
      ),
    };

    const result = await judgeContradiction(makeDecision(), 'test', client);
    expect(result).not.toBeNull();
    expect(result!.confidence).toBe(1);
  });
});
