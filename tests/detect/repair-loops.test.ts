import { describe, it, expect } from 'vitest';
import { detectRepairLoops, scoreRepairLoops } from '../../src/detect/repair-loops.js';
import type { ParsedTurn } from '../../src/types.js';

function makeTurns(specs: Array<{ text: string; exitCode?: number; error?: string }>): ParsedTurn[] {
  return specs.map((s, i) => ({
    index: i + 1,
    type: 'assistant' as const,
    text: s.text,
    toolCalls: s.exitCode !== undefined || s.error
      ? [{
          toolName: 'Bash',
          exitCode: s.exitCode,
          error: s.error,
        }]
      : [],
    codeBlocks: 0,
    wordCount: s.text.split(/\s+/).length,
    hedgingCount: 0,
  }));
}

describe('repair loop detection (Signal 3)', () => {
  it('returns empty for clean sessions', () => {
    const turns = makeTurns([
      { text: 'Implemented the feature successfully.' },
      { text: 'Tests are passing.' },
      { text: 'Deployment complete.' },
    ]);
    const signals = detectRepairLoops(turns);
    expect(signals).toEqual([]);
  });

  it('detects consecutive tool failures', () => {
    const turns = makeTurns([
      { text: 'Running build...', exitCode: 1, error: 'TypeError: x is not defined' },
      { text: 'Let me fix that...', exitCode: 1, error: 'TypeError: x is not defined' },
      { text: 'Trying again...', exitCode: 1, error: 'TypeError: x is not defined' },
    ]);
    const signals = detectRepairLoops(turns);
    expect(signals.length).toBeGreaterThan(0);
    expect(signals[0].type).toBe('repair-loop');
  });

  it('detects repeated error messages in text', () => {
    const turns = makeTurns([
      { text: 'TypeError: Cannot read properties of null.\nLet me fix that.' },
      { text: 'Still getting TypeError: Cannot read properties of null.\nTrying another approach.' },
      { text: 'TypeError: Cannot read properties of null.\nLet me try a different fix.' },
      { text: 'Finally fixed it.' },
    ]);
    const signals = detectRepairLoops(turns);
    const errorSignals = signals.filter((s) => s.details?.includes('appeared'));
    expect(errorSignals.length).toBeGreaterThan(0);
  });

  it('detects retry language patterns', () => {
    const turns = makeTurns([
      { text: 'Let me try that again with a different approach.' },
      { text: "That didn't work, let me try again." },
      { text: 'Let me fix that again, sorry about the error.' },
    ]);
    const signals = detectRepairLoops(turns);
    expect(signals.length).toBeGreaterThan(0);
  });

  it('scores repair loops correctly', () => {
    expect(scoreRepairLoops([])).toBe(0);

    const signals = [
      { type: 'repair-loop' as const, turn: 10, score: 90, description: 'test' },
    ];
    expect(scoreRepairLoops(signals)).toBeGreaterThan(0);
  });
});
