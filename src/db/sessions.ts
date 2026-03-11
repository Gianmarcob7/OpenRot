import type Database from 'better-sqlite3';
import type { Session, SessionRow } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

export class SessionStore {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  create(editor?: string): Session {
    const session: Session = {
      id: uuidv4(),
      createdAt: Date.now(),
      editor: editor || null,
      endedAt: null,
    };

    this.db
      .prepare('INSERT INTO sessions (id, created_at, editor, ended_at) VALUES (?, ?, ?, ?)')
      .run(session.id, session.createdAt, session.editor, session.endedAt);

    return session;
  }

  getById(id: string): Session | null {
    const row = this.db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as
      | SessionRow
      | undefined;

    if (!row) return null;
    return this.rowToSession(row);
  }

  getAll(): Session[] {
    const rows = this.db
      .prepare('SELECT * FROM sessions ORDER BY created_at DESC')
      .all() as SessionRow[];

    return rows.map((row) => this.rowToSession(row));
  }

  end(id: string): void {
    this.db.prepare('UPDATE sessions SET ended_at = ? WHERE id = ?').run(Date.now(), id);
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM warnings WHERE session_id = ?').run(id);
    this.db.prepare('DELETE FROM decisions WHERE session_id = ?').run(id);
    this.db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
  }

  deleteAll(): void {
    this.db.prepare('DELETE FROM warnings').run();
    this.db.prepare('DELETE FROM decisions').run();
    this.db.prepare('DELETE FROM sessions').run();
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
