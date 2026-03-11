import type { Database } from 'sql.js';
import type { Warning, WarningRow } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

export class WarningStore {
  private db: Database;
  private save: () => void;

  constructor(db: Database, save: () => void = () => {}) {
    this.db = db;
    this.save = save;
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

    this.db.run(
      `INSERT INTO warnings (id, session_id, current_turn, prior_decision_id, confidence, reason, dismissed, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        warning.id,
        warning.sessionId,
        warning.currentTurn,
        warning.priorDecisionId,
        warning.confidence,
        warning.reason,
        warning.dismissed ? 1 : 0,
        warning.createdAt,
      ],
    );
    this.save();

    return warning;
  }

  getById(id: string): Warning | null {
    const results = this.db.exec('SELECT * FROM warnings WHERE id = ?', [id]);
    if (!results.length || !results[0].values.length) return null;
    return this.rowToWarning(this.mapRow(results[0].columns, results[0].values[0]));
  }

  getBySessionId(sessionId: string): Warning[] {
    const results = this.db.exec(
      'SELECT * FROM warnings WHERE session_id = ? ORDER BY created_at DESC',
      [sessionId],
    );
    if (!results.length) return [];
    return results[0].values.map((row) =>
      this.rowToWarning(this.mapRow(results[0].columns, row)),
    );
  }

  getActiveBySessionId(sessionId: string): Warning[] {
    const results = this.db.exec(
      'SELECT * FROM warnings WHERE session_id = ? AND dismissed = 0 ORDER BY created_at DESC',
      [sessionId],
    );
    if (!results.length) return [];
    return results[0].values.map((row) =>
      this.rowToWarning(this.mapRow(results[0].columns, row)),
    );
  }

  dismiss(id: string): boolean {
    this.db.run('UPDATE warnings SET dismissed = 1 WHERE id = ?', [id]);
    const changed = this.db.getRowsModified();
    if (changed > 0) this.save();
    return changed > 0;
  }

  countBySessionId(sessionId: string): number {
    const results = this.db.exec(
      'SELECT COUNT(*) as count FROM warnings WHERE session_id = ?',
      [sessionId],
    );
    if (!results.length || !results[0].values.length) return 0;
    return results[0].values[0][0] as number;
  }

  deleteBySessionId(sessionId: string): void {
    this.db.run('DELETE FROM warnings WHERE session_id = ?', [sessionId]);
    this.save();
  }

  private mapRow(columns: string[], values: unknown[]): WarningRow {
    const row: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row as unknown as WarningRow;
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
