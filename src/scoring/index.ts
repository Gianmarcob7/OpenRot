import type { Database } from 'sql.js';
import type { RotScore, RotLevel, TranscriptMessage } from '../types.js';
import { scoreContradictions } from './contradictions.js';
import { scoreRepetitionFast } from './repetition.js';
import { scoreSaturation } from './saturation.js';
import { getLastAssistantResponses, countTurns } from '../transcript/index.js';
import { v4 as uuidv4 } from 'uuid';

const SIGNAL_WEIGHTS = {
  contradiction: 0.4,
  repetition: 0.3,
  saturation: 0.3,
};

/**
 * Compute the combined rot score from all three signals.
 * Uses fast (non-embedding) repetition by default for <5s execution.
 */
export function computeRotScore(
  db: Database,
  sessionId: string,
  messages: TranscriptMessage[],
): RotScore {
  const turn = countTurns(messages);

  // Signal A: Decision contradiction rate (40%)
  const contradictionScore = scoreContradictions(db, sessionId);

  // Signal B: Self-repetition (30%) — use fast mode for hook speed
  const recentResponses = getLastAssistantResponses(messages, 5);
  const repetitionScore = scoreRepetitionFast(recentResponses);

  // Signal C: Context saturation (30%)
  const saturationScore = scoreSaturation(messages);

  // Combined weighted score
  const combined = Math.round(
    contradictionScore * SIGNAL_WEIGHTS.contradiction +
    repetitionScore * SIGNAL_WEIGHTS.repetition +
    saturationScore * SIGNAL_WEIGHTS.saturation,
  );

  const level = getRotLevel(combined);

  return {
    contradictionScore: Math.round(contradictionScore),
    repetitionScore: Math.round(repetitionScore),
    saturationScore: Math.round(saturationScore),
    combined,
    level,
    turn,
  };
}

/**
 * Determine rot level from combined score.
 */
export function getRotLevel(score: number): RotLevel {
  if (score <= 30) return 'green';
  if (score <= 60) return 'yellow';
  return 'red';
}

/**
 * Format a rot score for Stop hook output.
 * Returns null if no output should be shown (green < 15).
 */
export function formatRotOutput(score: RotScore): { stderr?: string; stdout?: string } | null {
  if (score.level === 'green' && score.combined < 15) {
    // Silent — no output
    return null;
  }

  if (score.level === 'green') {
    // Suppress output but log
    return { stdout: JSON.stringify({ suppressOutput: true }) };
  }

  if (score.level === 'yellow') {
    return {
      stderr: `⚠️ OpenRot: Session health ${score.combined}% — quality may be degrading`,
    };
  }

  // Red
  return {
    stderr: `🔴 OpenRot: Session health ${score.combined}% — output unreliable\n   Run 'openrot handoff' for a fresh start with full context preserved`,
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
        score.contradictionScore,
        score.repetitionScore,
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

    return {
      contradictionScore: row.contradiction_score as number,
      repetitionScore: row.repetition_score as number,
      saturationScore: row.saturation_score as number,
      combined: row.combined_score as number,
      level: getRotLevel(row.combined_score as number),
      turn: row.turn as number,
    };
  } catch {
    return null;
  }
}
