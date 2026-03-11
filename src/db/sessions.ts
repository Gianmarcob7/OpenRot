import type { Database } from 'sql.js';
import type { Session, SessionRow } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

export class SessionStore {
  private db: Database;
  private save: () => void;

  constructor(db: Database, save: () => void = () => {}) {
    this.db = db;
    this.save = save;
  }

  create(editor?: string): Session {
    const session: Session = {
      id: uuidv4(),
      createdAt: Date.now(),
      editor: editor || null,
      endedAt: null,
    };

    this.db.run(
      'INSERT INTO sessions (id, created_at, editor, ended_at) VALUES (?, ?, ?, ?)',
      [session.id, session.createdAt, session.editor, session.endedAt],
    );
    this.save();

    return session;
  }

  getById(id: string): Session | null {
    const results = this.db.exec('SELECT * FROM sessions WHERE id = ?', [id]);
    if (!results.length || !results[0].values.length) return null;
    return this.rowToSession(this.mapRow(results[0].columns, results[0].values[0]));
  }

  getAll(): Session[] {
    const results = this.db.exec('SELECT * FROM sessions ORDER BY created_at DESC');
    if (!results.length) return [];
    return results[0].values.map((row) =>
      this.rowToSession(this.mapRow(results[0].columns, row)),
    );
  }

  end(id: string): void {
    this.db.run('UPDATE sessions SET ended_at = ? WHERE id = ?', [Date.now(), id]);
    this.save();
  }

  delete(id: string): void {
    this.db.run('DELETE FROM warnings WHERE session_id = ?', [id]);
    this.db.run('DELETE FROM decisions WHERE session_id = ?', [id]);
    this.db.run('DELETE FROM sessions WHERE id = ?', [id]);
    this.save();
  }

  deleteAll(): void {
    this.db.run('DELETE FROM warnings');
    this.db.run('DELETE FROM decisions');
    this.db.run('DELETE FROM sessions');
    this.save();
  }

  private mapRow(columns: string[], values: unknown[]): SessionRow {
    const row: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row as unknown as SessionRow;
  }

  private rowToSession(row: SessionRow): Session {
    return {
      id: row.id,
      createdAt: row.created_at,
      editor: row.editor,
      endedAt: row.ended_at,
    };
  }
}
