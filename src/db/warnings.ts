import type Database from 'better-sqlite3';
import type { Warning, WarningRow } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

export class WarningStore {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  create(
    sessionId: string,
    currentTurn: number,
    priorDecisionId: string,
    confidence: number,
    reason: string,
  ): Warning {
    const warning: Warning = {
      id: uuidv4(),
      sessionId,
      currentTurn,
      priorDecisionId,
      confidence,
      reason,
      dismissed: false,
      createdAt: Date.now(),
    };

    this.db
      .prepare(
        `INSERT INTO warnings (id, session_id, current_turn, prior_decision_id, confidence, reason, dismissed, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        warning.id,
        warning.sessionId,
        warning.currentTurn,
        warning.priorDecisionId,
        warning.confidence,
        warning.reason,
        warning.dismissed ? 1 : 0,
        warning.createdAt,
      );

    return warning;
  }

  getById(id: string): Warning | null {
    const row = this.db.prepare('SELECT * FROM warnings WHERE id = ?').get(id) as
      | WarningRow
      | undefined;

    if (!row) return null;
    return this.rowToWarning(row);
  }

  getBySessionId(sessionId: string): Warning[] {
    const rows = this.db
      .prepare('SELECT * FROM warnings WHERE session_id = ? ORDER BY created_at DESC')
      .all(sessionId) as WarningRow[];

    return rows.map((row) => this.rowToWarning(row));
  }

  getActiveBySessionId(sessionId: string): Warning[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM warnings WHERE session_id = ? AND dismissed = 0 ORDER BY created_at DESC',
      )
      .all(sessionId) as WarningRow[];

    return rows.map((row) => this.rowToWarning(row));
  }

  dismiss(id: string): boolean {
    const result = this.db.prepare('UPDATE warnings SET dismissed = 1 WHERE id = ?').run(id);
    return result.changes > 0;
  }

  countBySessionId(sessionId: string): number {
    const row = this.db
      .prepare('SELECT COUNT(*) as count FROM warnings WHERE session_id = ?')
      .get(sessionId) as { count: number };
    return row.count;
  }

  deleteBySessionId(sessionId: string): void {
    this.db.prepare('DELETE FROM warnings WHERE session_id = ?').run(sessionId);
  }

  private rowToWarning(row: WarningRow): Warning {
    return {
      id: row.id,
      sessionId: row.session_id,
      currentTurn: row.current_turn,
      priorDecisionId: row.prior_decision_id,
      confidence: row.confidence,
      reason: row.reason,
      dismissed: row.dismissed === 1,
      createdAt: row.created_at,
    };
  }
}
