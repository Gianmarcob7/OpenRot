import type { DetectionSignal, ParsedTurn } from '../types.js';
import { extractWithRegex } from '../extract/regex.js';

interface ActiveDecision {
  turn: number;
  commitment: string;
  type: string;
  source: 'user' | 'assistant';
  supersededAt?: number;
}

/**
 * Signal 1: Instruction Violations (weight: 25%)
 *
 * Only flags when the AI contradicts an active decision ON ITS OWN.
 * If the USER changes their mind, that updates the decision — not a violation.
 *
 * Logic:
 * 1. Extract decisions from USER messages → active decision list
 * 2. Also extract from assistant messages that CONFIRM user decisions
 * 3. When user contradicts a prior decision → supersede the old one (not a violation)
 * 4. When assistant contradicts an active decision without user instruction → violation
 */
export function detectViolations(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];
  if (turns.length < 6) return signals;

  const activeDecisions: ActiveDecision[] = [];
  const log: VerboseEntry[] = [];

  // Walk through turns chronologically, maintaining a mutable decision list
  for (const turn of turns) {
    const extracted = extractWithRegex(turn.text);
    if (extracted.length === 0) continue;

    if (turn.type === 'user') {
      // User decisions: add or supersede
      for (const e of extracted) {
        const superseded = findContradictedDecision(activeDecisions, e.commitment);
        if (superseded) {
          superseded.supersededAt = turn.index;
          log.push({
            turn: turn.index,
            event: 'decision-updated',
            detail: `User changed "${superseded.commitment}" → "${e.commitment}"`,
          });
        }
        activeDecisions.push({
          turn: turn.index,
          commitment: e.commitment,
          type: e.type,
          source: 'user',
        });
        log.push({
          turn: turn.index,
          event: 'decision-added',
          detail: `User: "${e.commitment}"`,
        });
      }
    } else {
      // Assistant message: check if it contradicts any active user decision
      for (const e of extracted) {
        const currentActive = activeDecisions.filter((d) => !d.supersededAt);
        const violated = findContradictedDecision(currentActive, e.commitment);

        if (violated) {
          // Check if a recent user message (within last 2 user turns) asked for this change
          const recentUserTurns = turns
            .filter((t) => t.type === 'user' && t.index < turn.index)
            .slice(-2);
          const userAskedForChange = recentUserTurns.some((ut) => {
            const userExtractions = extractWithRegex(ut.text);
            return userExtractions.some((ue) => isAligned(ue.commitment, e.commitment));
          });

          if (!userAskedForChange) {
            signals.push({
              type: 'violation',
              turn: turn.index,
              score: 80,
              description: 'Instruction violation',
              details: `AI contradicted "${violated.commitment}" (user decided at turn ${violated.turn})`,
            });
            log.push({
              turn: turn.index,
              event: 'violation',
              detail: `AI said "${e.commitment}" — contradicts active decision "${violated.commitment}" (turn ${violated.turn})`,
            });
          }
        }

        // Also check direct code-level violations against active decisions
        const currentActiveForDirect = activeDecisions.filter((d) => !d.supersededAt);
        for (const decision of currentActiveForDirect) {
          const violation = checkDirectViolation(turn.text, decision.commitment);
          if (violation) {
            signals.push({
              type: 'violation',
              turn: turn.index,
              score: 70,
              description: 'Instruction violation',
              details: `${violation} (user decided "${decision.commitment}" at turn ${decision.turn})`,
            });
          }
        }
      }
    }
  }

  // Attach verbose log for --verbose output
  const result = deduplicateSignals(signals);
  (result as ViolationSignals).__verboseLog = log;
  (result as ViolationSignals).__decisions = activeDecisions;
  return result;
}

export interface VerboseEntry {
  turn: number;
  event: 'decision-added' | 'decision-updated' | 'violation';
  detail: string;
}

export interface ViolationSignals extends Array<DetectionSignal> {
  __verboseLog?: VerboseEntry[];
  __decisions?: ActiveDecision[];
}

/**
 * Find an active decision that the new commitment contradicts.
 */
function findContradictedDecision(
  decisions: ActiveDecision[],
  newCommitment: string,
): ActiveDecision | undefined {
  for (const d of decisions) {
    if (d.supersededAt) continue;
    if (isContradiction(d.commitment, newCommitment)) return d;
  }
  return undefined;
}

/**
 * Check if two commitments are aligned (same direction, same topic).
 */
function isAligned(a: string, b: string): boolean {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  // Both "use X" with overlapping subjects
  const aUse = aLower.match(/^(?:use|only use|stick with|using)\s+(.+)/);
  const bUse = bLower.match(/^(?:use|only use|stick with|using)\s+(.+)/);
  if (aUse && bUse) return hasSignificantOverlap(aUse[1], bUse[1]);

  // Both "avoid X" with overlapping subjects
  const aAvoid = aLower.match(/^(?:avoid|never use|don't use)\s+(.+)/);
  const bAvoid = bLower.match(/^(?:avoid|never use|don't use)\s+(.+)/);
  if (aAvoid && bAvoid) return hasSignificantOverlap(aAvoid[1], bAvoid[1]);

  return false;
}

function isContradiction(existing: string, incoming: string): boolean {
  const existingLower = existing.toLowerCase();
  const incomingLower = incoming.toLowerCase();

  // "use X" vs "avoid X" / "don't use X" / "never use X"
  const useMatch = existingLower.match(/^(?:use|only use|stick with|using)\s+(.+)/);
  const avoidMatch = incomingLower.match(/^(?:avoid|never use|don't use|no)\s+(.+)/);
  if (useMatch && avoidMatch) {
    return hasSignificantOverlap(useMatch[1], avoidMatch[1]);
  }

  // Reverse: "avoid X" vs "use X"
  const existingAvoid = existingLower.match(/^(?:avoid|never use|don't use|no)\s+(.+)/);
  const incomingUse = incomingLower.match(/^(?:use|only use|stick with|using)\s+(.+)/);
  if (existingAvoid && incomingUse) {
    return hasSignificantOverlap(existingAvoid[1], incomingUse[1]);
  }

  // Same topic, different choice (e.g. "use PostgreSQL for DB" vs "use SQLite for DB")
  const existingUse2 = existingLower.match(/^(?:use|using)\s+(.+?)(?:\s+for\s+(.+))?$/);
  const incomingUse2 = incomingLower.match(/^(?:use|using)\s+(.+?)(?:\s+for\s+(.+))?$/);
  if (existingUse2 && incomingUse2 && existingUse2[2] && incomingUse2[2]) {
    if (hasSignificantOverlap(existingUse2[2], incomingUse2[2]) &&
        !hasSignificantOverlap(existingUse2[1], incomingUse2[1])) {
      return true;
    }
  }

  return false;
}

function hasSignificantOverlap(a: string, b: string): boolean {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return false;

  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++;
  }
  return overlap / Math.min(wordsA.size, wordsB.size) > 0.5;
}

function checkDirectViolation(text: string, decision: string): string | null {
  const decLower = decision.toLowerCase();

  if (decLower.includes('tailwind') && !decLower.includes('avoid') && /style\s*=\s*\{/.test(text)) {
    return 'Used inline styles';
  }

  if (decLower.includes('typescript') && !decLower.includes('avoid') && /require\s*\(/.test(text) && !text.toLowerCase().includes('import')) {
    return 'Used require() instead of import';
  }

  return null;
}

function deduplicateSignals(signals: DetectionSignal[]): DetectionSignal[] {
  const seen = new Set<string>();
  return signals.filter((s) => {
    const key = `${s.turn}:${s.description}:${s.details}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Compute the violation score (0-100) from detected signals.
 */
export function scoreViolations(signals: DetectionSignal[]): number {
  const violationSignals = signals.filter((s) => s.type === 'violation');
  if (violationSignals.length === 0) return 0;
  return Math.min(100, violationSignals.length * 25);
}
