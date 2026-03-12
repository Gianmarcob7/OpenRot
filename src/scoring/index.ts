import type { Database } from 'sql.js';
import type { RotScore, RotLevel, TranscriptMessage } from '../types.js';
import { analyzeTranscript, getRotLevel } from '../detect/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Compute the combined rot score using the new 5-signal detection engine.
 * This is a compatibility wrapper for code that still calls computeRotScore.
 */
export function computeRotScore(
  _db: Database,
  _sessionId: string,
  messages: TranscriptMessage[],
): RotScore {
  const result = analyzeTranscript(messages);
  return result.score;
}

/**
 * Format a rot score for Stop hook output.
 * Returns null if no output should be shown (healthy).
 */
export function formatRotOutput(score: RotScore): { stderr?: string; stdout?: string } | null {
  if (score.level === 'healthy') {
    return null;
  }

  if (score.level === 'degrading') {
    return {
      stderr: `⚠️ OpenRot: Session degrading (${score.combined}%) — quality may be dropping`,
    };
  }

  // Rotted
  const rotInfo = score.rotPoint ? ` — quality dropped at turn ${score.rotPoint}` : '';
  return {
    stderr: `🔴 OpenRot: Session rotted (${score.combined}%)${rotInfo}\n   Run 'openrot fix' for a fresh start with full context preserved`,
  };
}

/**
 * Save a rot score to the database.
 */
export function saveRotScore(
  db: Database,
  sessionId: string,
  score: RotScore,
  saveFn: () => void = () => {},
): void {
  try {
    db.run(
      `INSERT INTO rot_scores (id, session_id, turn, contradiction_score, repetition_score, saturation_score, combined_score, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        sessionId,
        score.turn,
        score.violationScore,
        score.circularScore + score.repairLoopScore,
        score.saturationScore,
        score.combined,
        Date.now(),
      ],
    );
    saveFn();
  } catch {
    // Fail silently
  }
}

/**
 * Get the latest rot score for a session.
 */
export function getLatestRotScore(db: Database, sessionId: string): RotScore | null {
  try {
    const results = db.exec(
      'SELECT * FROM rot_scores WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
      [sessionId],
    );
    if (!results.length || !results[0].values.length) return null;

    const cols = results[0].columns;
    const vals = results[0].values[0];
    const row: Record<string, unknown> = {};
    cols.forEach((c, i) => { row[c] = vals[i]; });

    const combined = row.combined_score as number;

    return {
      violationScore: row.contradiction_score as number,
      circularScore: 0,
      repairLoopScore: 0,
      qualityScore: 0,
      saturationScore: row.saturation_score as number,
      combined,
      level: getRotLevel(combined),
      turn: row.turn as number,
      rotPoint: null,
    };
  } catch {
    return null;
  }
}

export { getRotLevel };
