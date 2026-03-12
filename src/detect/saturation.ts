import type { DetectionSignal, ParsedTurn } from '../types.js';
import { CHARS_PER_TOKEN, CONTEXT_LIMIT } from '../transcript/tokens.js';

/**
 * Signal 5: Context Saturation (weight: 10%)
 *
 * Estimates token usage from transcript and flags when approaching
 * the point where models degrade (research shows quality drops well
 * before hitting the context limit).
 */
export function detectSaturation(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];

  // Estimate total tokens
  const totalChars = turns.reduce((sum, t) => sum + t.text.length, 0);
  const estimatedTokens = Math.ceil(totalChars / CHARS_PER_TOKEN);
  const saturationPct = (estimatedTokens / CONTEXT_LIMIT) * 100;

  if (saturationPct >= 80) {
    signals.push({
      type: 'saturation',
      turn: turns[turns.length - 1]?.index ?? 0,
      score: 90,
      description: 'Context window nearly full',
      details: `~${formatTokens(estimatedTokens)} tokens used (${Math.round(saturationPct)}% of ${formatTokens(CONTEXT_LIMIT)})`,
    });
  } else if (saturationPct >= 60) {
    signals.push({
      type: 'saturation',
      turn: turns[turns.length - 1]?.index ?? 0,
      score: 60,
      description: 'Context saturation rising',
      details: `~${formatTokens(estimatedTokens)} tokens used (${Math.round(saturationPct)}% of ${formatTokens(CONTEXT_LIMIT)})`,
    });
  } else if (saturationPct >= 40) {
    signals.push({
      type: 'saturation',
      turn: turns[turns.length - 1]?.index ?? 0,
      score: 30,
      description: 'Context usage moderate',
      details: `~${formatTokens(estimatedTokens)} tokens used (${Math.round(saturationPct)}%)`,
    });
  }

  // Token accumulation rate (rapid growth = bad sign)
  if (turns.length >= 10) {
    const firstQuarter = turns.slice(0, Math.floor(turns.length / 4));
    const lastQuarter = turns.slice(-Math.floor(turns.length / 4));

    const rateFirst = firstQuarter.reduce((s, t) => s + t.text.length, 0) / Math.max(1, firstQuarter.length);
    const rateLast = lastQuarter.reduce((s, t) => s + t.text.length, 0) / Math.max(1, lastQuarter.length);

    if (rateFirst > 0 && rateLast / rateFirst > 2) {
      signals.push({
        type: 'saturation',
        turn: lastQuarter[0]?.index ?? 0,
        score: 40,
        description: 'Token accumulation accelerating',
        details: `Message sizes grew ${(rateLast / rateFirst).toFixed(1)}x from session start`,
      });
    }
  }

  return signals;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/**
 * Compute the saturation score (0-100) from detected signals.
 */
export function scoreSaturation(signals: DetectionSignal[]): number {
  const saturationSignals = signals.filter((s) => s.type === 'saturation');
  if (saturationSignals.length === 0) return 0;
  return Math.min(100, Math.max(...saturationSignals.map((s) => s.score)));
}
