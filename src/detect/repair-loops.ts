import type { DetectionSignal, ParsedTurn } from '../types.js';

/**
 * Signal 3: Repair Loops (weight: 25%)
 *
 * Detects when the AI writes code → error occurs → AI fixes → same error → fix again.
 * This is the most visceral signal — developers immediately recognize this pain.
 */
export function detectRepairLoops(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];
  const assistantTurns = turns.filter((t) => t.type === 'assistant');

  // Strategy 1: Detect consecutive tool failures (non-zero exit codes)
  signals.push(...detectConsecutiveFailures(turns));

  // Strategy 2: Detect repeated error messages in text
  signals.push(...detectRepeatedErrors(assistantTurns));

  // Strategy 3: Detect "let me try again" patterns
  signals.push(...detectRetryPatterns(assistantTurns));

  return deduplicateSignals(signals);
}

/**
 * Detect consecutive tool calls with non-zero exit codes.
 */
function detectConsecutiveFailures(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];
  let consecutiveErrors = 0;
  let errorPattern = '';
  let firstErrorTurn = 0;

  for (const turn of turns) {
    const hasError = turn.toolCalls.some((t) => t.exitCode !== undefined && t.exitCode !== 0);
    const errorText = turn.toolCalls
      .filter((t) => t.error)
      .map((t) => t.error!)
      .join(' ');

    if (hasError) {
      if (consecutiveErrors === 0) {
        firstErrorTurn = turn.index;
        errorPattern = errorText.substring(0, 100);
      }
      consecutiveErrors++;

      if (consecutiveErrors >= 3) {
        signals.push({
          type: 'repair-loop',
          turn: turn.index,
          score: 90,
          description: 'Repair loop',
          details: `${consecutiveErrors} consecutive failed attempts${errorPattern ? ` — ${errorPattern}` : ''}`,
        });
      }
    } else {
      consecutiveErrors = 0;
    }
  }

  return signals;
}

/**
 * Detect the same error message appearing multiple times across turns.
 */
function detectRepeatedErrors(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];
  const errorCounts: Map<string, number[]> = new Map();

  const errorPatterns = [
    /(?:TypeError|ReferenceError|SyntaxError|Error):\s*(.+?)(?:\.|,|\n|$)/gi,
    /error\[E\d+\]:\s*(.+?)(?:\.|,|\n|$)/gi,
    /(?:FAIL|FAILED):\s*(.+?)(?:\.|,|\n|$)/gi,
    /Cannot\s+(.+?)(?:\.|,|\n|$)/gi,
  ];

  for (const turn of turns) {
    const text = turn.text;
    for (const pattern of errorPatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const normalized = normalizeError(match[1]);
        if (normalized.length < 5) continue;
        const occurrences = errorCounts.get(normalized) || [];
        occurrences.push(turn.index);
        errorCounts.set(normalized, occurrences);
      }
    }
  }

  for (const [error, turns_] of errorCounts) {
    if (turns_.length >= 3) {
      signals.push({
        type: 'repair-loop',
        turn: turns_[turns_.length - 1],
        score: 85,
        description: 'Repair loop',
        details: `Same error "${error.substring(0, 60)}" appeared ${turns_.length} times`,
      });
    }
  }

  return signals;
}

/**
 * Detect "let me try again" / "let me fix that" patterns that indicate
 * the AI is stuck in a repair loop.
 */
function detectRetryPatterns(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];

  const retryPatterns = [
    /let me (?:try|fix|correct|address) (?:that|this|it) again/gi,
    /(?:I apologize|sorry),?\s*(?:let me|I'll) (?:try|fix|correct)/gi,
    /that (?:didn't work|failed|caused an error)/gi,
    /(?:still|again) (?:getting|seeing|hitting) (?:the same|that|this) error/gi,
    /(?:another|different) approach/gi,
    /(?:going back to|reverting to|trying again with)/gi,
  ];

  let retryCount = 0;
  let retryStart = 0;

  for (const turn of turns) {
    const hasRetry = retryPatterns.some((p) => {
      p.lastIndex = 0;
      return p.test(turn.text);
    });

    if (hasRetry) {
      if (retryCount === 0) retryStart = turn.index;
      retryCount++;

      if (retryCount >= 3) {
        signals.push({
          type: 'repair-loop',
          turn: turn.index,
          score: 75,
          description: 'Repair loop',
          details: `${retryCount} retry attempts since turn ${retryStart}`,
        });
      }
    } else {
      retryCount = 0;
    }
  }

  return signals;
}

function normalizeError(error: string): string {
  return error
    .trim()
    .toLowerCase()
    .replace(/\d+/g, 'N')
    .replace(/['"][^'"]+['"]/g, 'STR')
    .replace(/\s+/g, ' ')
    .substring(0, 80);
}

function deduplicateSignals(signals: DetectionSignal[]): DetectionSignal[] {
  const seen = new Set<string>();
  return signals.filter((s) => {
    const key = `${s.turn}:${s.type}:${s.details?.substring(0, 40)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Compute the repair-loop score (0-100) from detected signals.
 */
export function scoreRepairLoops(signals: DetectionSignal[]): number {
  const repairSignals = signals.filter((s) => s.type === 'repair-loop');
  if (repairSignals.length === 0) return 0;
  return Math.min(100, repairSignals.reduce((sum, s) => sum + s.score, 0) / repairSignals.length + repairSignals.length * 15);
}
