import type { Decision } from '../types.js';
import type { Database } from 'sql.js';
import { DecisionStore } from '../db/decisions.js';
import { WarningStore } from '../db/warnings.js';

/**
 * Signal A: Decision contradiction rate.
 * Score = (contradictions / total decisions) * 100
 * Weight: 40%
 */
export function scoreContradictions(
  db: Database,
  sessionId: string,
): number {
  try {
    const decisionStore = new DecisionStore(db);
    const warningStore = new WarningStore(db);

    const decisions = decisionStore.getBySessionId(sessionId);
    const warnings = warningStore.getBySessionId(sessionId);

    if (decisions.length === 0) return 0;

    const contradictionRate = warnings.length / decisions.length;
    return Math.min(100, contradictionRate * 100);
  } catch {
    return 0;
  }
}
