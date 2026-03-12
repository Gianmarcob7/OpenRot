import type { DetectionSignal, ParsedTurn } from '../types.js';
import { countHedgingPhrases } from '../transcript/tokens.js';

/**
 * Signal 4: Response Quality Decline (weight: 15%)
 *
 * Tracks: response length shrinking, hedging language increasing,
 * code block frequency decreasing.
 */
export function detectQualityDecline(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];
  const assistantTurns = turns.filter((t) => t.type === 'assistant');
  if (assistantTurns.length < 6) return signals;

  // Split into first half vs second half
  const mid = Math.floor(assistantTurns.length / 2);
  const firstHalf = assistantTurns.slice(0, mid);
  const secondHalf = assistantTurns.slice(mid);

  // Check response length shrinkage
  const lengthSignal = detectLengthDecline(firstHalf, secondHalf);
  if (lengthSignal) signals.push(lengthSignal);

  // Check hedging increase
  const hedgingSignal = detectHedgingIncrease(firstHalf, secondHalf);
  if (hedgingSignal) signals.push(hedgingSignal);

  // Check code block decrease
  const codeSignal = detectCodeBlockDecline(firstHalf, secondHalf);
  if (codeSignal) signals.push(codeSignal);

  // Sliding window quality check for pinpointing the decline turn
  const windowSignals = detectSlidingWindowDecline(assistantTurns);
  signals.push(...windowSignals);

  return signals;
}

function detectLengthDecline(first: ParsedTurn[], second: ParsedTurn[]): DetectionSignal | null {
  const avgFirst = average(first.map((t) => t.wordCount));
  const avgSecond = average(second.map((t) => t.wordCount));

  if (avgFirst === 0) return null;
  const ratio = avgSecond / avgFirst;

  if (ratio < 0.4) {
    return {
      type: 'quality-decline',
      turn: second[0].index,
      score: 80,
      description: 'Response quality decline',
      details: `Response length dropped to ${Math.round(ratio * 100)}% of earlier average`,
    };
  }
  if (ratio < 0.6) {
    return {
      type: 'quality-decline',
      turn: second[0].index,
      score: 50,
      description: 'Response quality decline',
      details: `Response length dropped to ${Math.round(ratio * 100)}% of earlier average`,
    };
  }
  return null;
}

function detectHedgingIncrease(first: ParsedTurn[], second: ParsedTurn[]): DetectionSignal | null {
  const avgHedgingFirst = average(first.map((t) => t.hedgingCount));
  const avgHedgingSecond = average(second.map((t) => t.hedgingCount));

  // Hedging increased by 2x or more
  if (avgHedgingSecond > avgHedgingFirst * 2 && avgHedgingSecond >= 3) {
    return {
      type: 'quality-decline',
      turn: second[0].index,
      score: 60,
      description: 'Hedging language increase',
      details: `Hedging phrases increased from ${avgHedgingFirst.toFixed(1)} to ${avgHedgingSecond.toFixed(1)} per response`,
    };
  }
  return null;
}

function detectCodeBlockDecline(first: ParsedTurn[], second: ParsedTurn[]): DetectionSignal | null {
  const avgCodeFirst = average(first.map((t) => t.codeBlocks));
  const avgCodeSecond = average(second.map((t) => t.codeBlocks));

  if (avgCodeFirst >= 1 && avgCodeSecond < avgCodeFirst * 0.3) {
    return {
      type: 'quality-decline',
      turn: second[0].index,
      score: 50,
      description: 'Less code, more talk',
      details: `Code blocks dropped from ${avgCodeFirst.toFixed(1)} to ${avgCodeSecond.toFixed(1)} per response`,
    };
  }
  return null;
}

/**
 * Sliding window approach to find the exact turn where quality starts declining.
 */
function detectSlidingWindowDecline(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];
  if (turns.length < 8) return signals;

  const windowSize = Math.max(3, Math.floor(turns.length / 5));

  for (let i = windowSize; i < turns.length - windowSize; i++) {
    const before = turns.slice(i - windowSize, i);
    const after = turns.slice(i, i + windowSize);

    const qualityBefore = computeWindowQuality(before);
    const qualityAfter = computeWindowQuality(after);

    if (qualityBefore > 0 && qualityAfter / qualityBefore < 0.5) {
      signals.push({
        type: 'quality-decline',
        turn: turns[i].index,
        score: 70,
        description: 'Quality cliff detected',
        details: `Sharp quality drop at turn ${turns[i].index}`,
      });
      break; // Only report the first cliff
    }
  }

  return signals;
}

function computeWindowQuality(turns: ParsedTurn[]): number {
  const avgLength = average(turns.map((t) => t.wordCount));
  const avgCode = average(turns.map((t) => t.codeBlocks));
  const avgHedging = average(turns.map((t) => t.hedgingCount));

  // Composite quality: more words + more code - hedging = better
  return avgLength * 0.5 + avgCode * 100 - avgHedging * 20;
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/**
 * Compute the quality score (0-100) from detected signals.
 */
export function scoreQuality(signals: DetectionSignal[]): number {
  const qualitySignals = signals.filter((s) => s.type === 'quality-decline');
  if (qualitySignals.length === 0) return 0;
  const avg = qualitySignals.reduce((sum, s) => sum + s.score, 0) / qualitySignals.length;
  return Math.min(100, avg + qualitySignals.length * 5);
}
