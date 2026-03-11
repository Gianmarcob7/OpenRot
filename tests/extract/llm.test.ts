import { describe, it, expect, vi } from 'vitest';
import { extractWithLLM } from '../../src/extract/llm.js';
import type { ModelClient } from '../../src/types.js';

function makeMockClient(response: string): ModelClient {
  return {
    complete: vi.fn().mockResolvedValue(response),
  };
}

describe('LLM extraction', () => {
  it('parses valid JSON array response', async () => {
    const client = makeMockClient(
      JSON.stringify([
        { commitment: 'use TypeScript', type: 'use', confidence: 0.9 },
        { commitment: 'avoid classes', type: 'avoid', confidence: 0.8 },
      ]),
    );

    const results = await extractWithLLM('some message', client);
    expect(results).toHaveLength(2);
    expect(results[0].commitment).toBe('use TypeScript');
    expect(results[0].type).toBe('use');
    expect(results[0].source).toBe('llm');
    expect(results[1].commitment).toBe('avoid classes');
  });

  it('handles markdown-wrapped JSON response', async () => {
    const client = makeMockClient(
      '```json\n[{"commitment": "use React", "type": "use", "confidence": 0.85}]\n```',
    );

    const results = await extractWithLLM('some message', client);
    expect(results).toHaveLength(1);
    expect(results[0].commitment).toBe('use React');
  });

  it('returns empty array for empty JSON array', async () => {
    const client = makeMockClient('[]');
    const results = await extractWithLLM('no decisions here', client);
    expect(results).toEqual([]);
  });

  it('returns empty array for invalid JSON', async () => {
    const client = makeMockClient('this is not json');
    const results = await extractWithLLM('some message', client);
    expect(results).toEqual([]);
  });

  it('returns empty array when client throws', async () => {
    const client: ModelClient = {
      complete: vi.fn().mockRejectedValue(new Error('API error')),
    };
    const results = await extractWithLLM('some message', client);
    expect(results).toEqual([]);
  });

  it('filters out items with invalid types', async () => {
    const client = makeMockClient(
      JSON.stringify([
        { commitment: 'use X', type: 'use', confidence: 0.9 },
        { commitment: 'invalid type', type: 'banana', confidence: 0.9 },
      ]),
    );

    const results = await extractWithLLM('some message', client);
    expect(results).toHaveLength(1);
    expect(results[0].commitment).toBe('use X');
  });

  it('filters out items with out-of-range confidence', async () => {
    const client = makeMockClient(
      JSON.stringify([
        { commitment: 'use X', type: 'use', confidence: 1.5 },
        { commitment: 'use Y', type: 'use', confidence: -0.1 },
        { commitment: 'use Z', type: 'use', confidence: 0.9 },
      ]),
    );

    const results = await extractWithLLM('some message', client);
    expect(results).toHaveLength(1);
    expect(results[0].commitment).toBe('use Z');
  });
});
