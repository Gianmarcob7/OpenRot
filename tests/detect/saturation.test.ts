import { describe, it, expect } from 'vitest';
import { detectSaturation, scoreSaturation } from '../../src/detect/saturation.js';
import type { ParsedTurn } from '../../src/types.js';

function makeTurns(charCounts: number[]): ParsedTurn[] {
  return charCounts.map((chars, i) => ({
    index: i + 1,
    type: 'assistant' as const,
    text: 'x'.repeat(chars),
    toolCalls: [],
    codeBlocks: 0,
    wordCount: Math.ceil(chars / 5),
    hedgingCount: 0,
  }));
}

describe('saturation detection (Signal 5)', () => {
  it('returns empty for small sessions', () => {
    const turns = makeTurns([100, 200, 300]);
    const signals = detectSaturation(turns);
    expect(signals.length).toBe(0);
  });

  it('detects moderate saturation', () => {
    // 200K context limit, 4 chars/token = 800K chars for 100%
    // 60% = 480K chars
    const charCount = 500_000;
    const turns = makeTurns([charCount]);
    const signals = detectSaturation(turns);
    expect(signals.length).toBeGreaterThan(0);
    expect(signals[0].type).toBe('saturation');
  });

  it('detects high saturation', () => {
    const charCount = 700_000;
    const turns = makeTurns([charCount]);
    const signals = detectSaturation(turns);
    const highSignals = signals.filter((s) => s.score >= 90);
    expect(highSignals.length).toBeGreaterThan(0);
  });

  it('detects token accumulation acceleration', () => {
    // First quarter: small messages, last quarter: large messages
    const turns = makeTurns([
      100, 100, 100, 100, 100, // small
      500, 600, 700, 800, 900, // medium
      2000, 3000, 4000, 5000, 6000, // large (2x+ growth)
      8000, 9000, 10000, 11000, 12000, // huge
    ]);
    const signals = detectSaturation(turns);
    const accelSignals = signals.filter((s) => s.details?.includes('grew'));
    expect(accelSignals.length).toBeGreaterThan(0);
  });

  it('scores saturation correctly', () => {
    expect(scoreSaturation([])).toBe(0);

    const signals = [
      { type: 'saturation' as const, turn: 50, score: 60, description: 'test' },
    ];
    expect(scoreSaturation(signals)).toBe(60);
  });
});
