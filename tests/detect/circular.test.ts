import { describe, it, expect } from 'vitest';
import { detectCircular, scoreCircular } from '../../src/detect/circular.js';
import type { ParsedTurn } from '../../src/types.js';

function makeTurns(specs: Array<{ toolCalls?: Array<{ toolName: string; filePath?: string }>; text?: string }>): ParsedTurn[] {
  return specs.map((s, i) => ({
    index: i + 1,
    type: 'assistant' as const,
    text: s.text || '',
    toolCalls: (s.toolCalls || []).map((tc) => ({
      toolName: tc.toolName,
      filePath: tc.filePath,
    })),
    codeBlocks: 0,
    wordCount: (s.text || '').split(/\s+/).length,
    hedgingCount: 0,
  }));
}

describe('circular pattern detection (Signal 2)', () => {
  it('returns empty for no tool calls', () => {
    const turns = makeTurns([
      { text: 'Hello world' },
      { text: 'Another response' },
    ]);
    const signals = detectCircular(turns);
    expect(signals).toEqual([]);
  });

  it('detects repeated file reads without edits', () => {
    const turns = makeTurns([
      { toolCalls: [{ toolName: 'Read', filePath: 'src/db/schema.ts' }] },
      { toolCalls: [{ toolName: 'Read', filePath: 'src/db/schema.ts' }] },
      { toolCalls: [{ toolName: 'Read', filePath: 'src/db/schema.ts' }] },
      { toolCalls: [{ toolName: 'Read', filePath: 'src/db/schema.ts' }] },
    ]);
    const signals = detectCircular(turns);
    expect(signals.length).toBeGreaterThan(0);
    expect(signals[0].type).toBe('circular');
    expect(signals[0].details).toContain('schema.ts');
  });

  it('does not flag reads with edits between them', () => {
    const turns = makeTurns([
      { toolCalls: [{ toolName: 'Read', filePath: 'src/app.ts' }] },
      { toolCalls: [{ toolName: 'Write', filePath: 'src/app.ts' }] },
      { toolCalls: [{ toolName: 'Read', filePath: 'src/app.ts' }] },
      { toolCalls: [{ toolName: 'Write', filePath: 'src/app.ts' }] },
    ]);
    const signals = detectCircular(turns);
    const fileReadSignals = signals.filter((s) => s.details?.includes('without changes'));
    expect(fileReadSignals).toEqual([]);
  });

  it('detects rapid edit cycles', () => {
    const turns = makeTurns([
      { toolCalls: [{ toolName: 'Edit', filePath: 'src/index.ts' }] },
      { toolCalls: [{ toolName: 'Edit', filePath: 'src/index.ts' }] },
      { toolCalls: [{ toolName: 'Edit', filePath: 'src/index.ts' }] },
    ]);
    const signals = detectCircular(turns);
    const editSignals = signals.filter((s) => s.details?.includes('Edited'));
    expect(editSignals.length).toBeGreaterThan(0);
  });

  it('scores circular signals correctly', () => {
    expect(scoreCircular([])).toBe(0);

    const signals = [
      { type: 'circular' as const, turn: 5, score: 75, description: 'test' },
    ];
    expect(scoreCircular(signals)).toBeGreaterThan(0);
  });
});
