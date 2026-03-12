import type { DetectionSignal, ParsedTurn } from '../types.js';
import { extractWithRegex } from '../extract/regex.js';

/**
 * Signal 1: Instruction Violations (weight: 25%)
 *
 * Detects when the AI contradicts decisions it established earlier.
 * Parse early turns for decisions (regex extraction), then check
 * later turns for violations of those decisions.
 */
export function detectViolations(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];
  const assistantTurns = turns.filter((t) => t.type === 'assistant');
  if (assistantTurns.length < 4) return signals;

  // Extract decisions from the first half of the session
  const midpoint = Math.floor(assistantTurns.length / 2);
  const earlyTurns = assistantTurns.slice(0, midpoint);
  const lateTurns = assistantTurns.slice(midpoint);

  const decisions: Array<{ turn: number; commitment: string; type: string }> = [];
  for (const turn of earlyTurns) {
    const extracted = extractWithRegex(turn.text);
    for (const e of extracted) {
      decisions.push({ turn: turn.index, commitment: e.commitment, type: e.type });
    }
  }

  if (decisions.length === 0) return signals;

  // Check late turns for contradictions of early decisions
  for (const turn of lateTurns) {
    const lateDecisions = extractWithRegex(turn.text);
    for (const late of lateDecisions) {
      for (const early of decisions) {
        if (isContradiction(early.commitment, late.commitment)) {
          signals.push({
            type: 'violation',
            turn: turn.index,
            score: 80,
            description: 'Instruction violation',
            details: `Contradicts "${early.commitment}" (established at turn ${early.turn})`,
          });
        }
      }
    }

    // Also check for direct keyword contradictions in the text
    for (const decision of decisions) {
      const violation = checkDirectViolation(turn.text, decision.commitment);
      if (violation) {
        signals.push({
          type: 'violation',
          turn: turn.index,
          score: 70,
          description: 'Instruction violation',
          details: `${violation} (decided "${decision.commitment}" at turn ${decision.turn})`,
        });
      }
    }
  }

  return deduplicateSignals(signals);
}

function isContradiction(early: string, late: string): boolean {
  const earlyLower = early.toLowerCase();
  const lateLower = late.toLowerCase();

  // "use X" vs "avoid X" / "don't use X"
  const useMatch = earlyLower.match(/^(?:use|only use|stick with)\s+(.+)/);
  const avoidMatch = lateLower.match(/^(?:avoid|never use|don't use)\s+(.+)/);
  if (useMatch && avoidMatch) {
    return hasSignificantOverlap(useMatch[1], avoidMatch[1]);
  }

  // Reverse: "avoid X" vs "use X"
  const earlyAvoid = earlyLower.match(/^(?:avoid|never use|don't use)\s+(.+)/);
  const lateUse = lateLower.match(/^(?:use|only use|stick with)\s+(.+)/);
  if (earlyAvoid && lateUse) {
    return hasSignificantOverlap(earlyAvoid[1], lateUse[1]);
  }

  // Same topic, different choice (e.g. "use PostgreSQL" vs "use SQLite")
  const earlyUse2 = earlyLower.match(/^(?:use|using)\s+(.+?)(?:\s+for\s+(.+))?$/);
  const lateUse2 = lateLower.match(/^(?:use|using)\s+(.+?)(?:\s+for\s+(.+))?$/);
  if (earlyUse2 && lateUse2 && earlyUse2[2] && lateUse2[2]) {
    if (hasSignificantOverlap(earlyUse2[2], lateUse2[2]) &&
        !hasSignificantOverlap(earlyUse2[1], lateUse2[1])) {
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
  const lower = text.toLowerCase();
  const decLower = decision.toLowerCase();

  // "use Tailwind" but text uses inline styles
  if (decLower.includes('tailwind') && /style\s*=\s*\{/.test(text)) {
    return 'Used inline styles';
  }

  // "avoid inline styles" but text uses them
  if (decLower.includes('inline style') && decLower.includes('avoid') && /style\s*=\s*\{/.test(text)) {
    return 'Used inline styles';
  }

  // "use TypeScript" but imports .js without types
  if (decLower.includes('typescript') && /require\s*\(/.test(text) && !lower.includes('import')) {
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
  // Each violation adds ~25, capped at 100
  return Math.min(100, violationSignals.length * 25);
}
