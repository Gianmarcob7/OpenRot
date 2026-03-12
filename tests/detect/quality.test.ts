import { describe, it, expect } from 'vitest';
import { detectQualityDecline, scoreQuality } from '../../src/detect/quality.js';
import type { ParsedTurn } from '../../src/types.js';

function makeTurns(specs: Array<{ wordCount: number; codeBlocks?: number; hedgingCount?: number }>): ParsedTurn[] {
  return specs.map((s, i) => ({
    index: i + 1,
    type: 'assistant' as const,
    text: 'x '.repeat(s.wordCount),
    toolCalls: [],
    codeBlocks: s.codeBlocks ?? 0,
    wordCount: s.wordCount,
    hedgingCount: s.hedgingCount ?? 0,
  }));
}

describe('quality decline detection (Signal 4)', () => {
  it('returns empty for short sessions', () => {
    const turns = makeTurns([
      { wordCount: 100 },
      { wordCount: 100 },
    ]);
    const signals = detectQualityDecline(turns);
    expect(signals).toEqual([]);
  });

  it('detects response length decline', () => {
    const turns = makeTurns([
      { wordCount: 500 },
      { wordCount: 480 },
      { wordCount: 460 },
      { wordCount: 450 },
      { wordCount: 100 },
      { wordCount: 80 },
      { wordCount: 60 },
      { wordCount: 50 },
    ]);
    const signals = detectQualityDecline(turns);
    const lengthSignals = signals.filter((s) => s.details?.includes('length'));
    expect(lengthSignals.length).toBeGreaterThan(0);
  });

  it('detects hedging increase', () => {
    const turns = makeTurns([
      { wordCount: 200, hedgingCount: 0 },
      { wordCount: 200, hedgingCount: 0 },
      { wordCount: 200, hedgingCount: 1 },
      { wordCount: 200, hedgingCount: 0 },
      { wordCount: 200, hedgingCount: 5 },
      { wordCount: 200, hedgingCount: 6 },
      { wordCount: 200, hedgingCount: 7 },
      { wordCount: 200, hedgingCount: 8 },
    ]);
    const signals = detectQualityDecline(turns);
    const hedgingSignals = signals.filter((s) => s.details?.includes('Hedging'));
    expect(hedgingSignals.length).toBeGreaterThan(0);
  });

  it('detects code block decline', () => {
    const turns = makeTurns([
      { wordCount: 200, codeBlocks: 3 },
      { wordCount: 200, codeBlocks: 4 },
      { wordCount: 200, codeBlocks: 3 },
      { wordCount: 200, codeBlocks: 2 },
      { wordCount: 200, codeBlocks: 0 },
      { wordCount: 200, codeBlocks: 0 },
      { wordCount: 200, codeBlocks: 0 },
      { wordCount: 200, codeBlocks: 0 },
    ]);
    const signals = detectQualityDecline(turns);
    const codeSignals = signals.filter((s) => s.details?.includes('Code blocks'));
    expect(codeSignals.length).toBeGreaterThan(0);
  });

  it('scores quality signals correctly', () => {
    expect(scoreQuality([])).toBe(0);
  });
});
