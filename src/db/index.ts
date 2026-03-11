import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';
import fs from 'fs';

let db: Database.Database | null = null;

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    editor TEXT,
    ended_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS decisions (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    turn INTEGER NOT NULL,
    raw_text TEXT NOT NULL,
    commitment TEXT NOT NULL,
    type TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 1.0,
    embedding BLOB,
    source TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  )`,
  `CREATE TABLE IF NOT EXISTS warnings (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    current_turn INTEGER NOT NULL,
    prior_decision_id TEXT NOT NULL,
    confidence REAL NOT NULL,
    reason TEXT NOT NULL,
    dismissed INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (prior_decision_id) REFERENCES decisions(id)
  )`,
  `CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_decisions_session ON decisions(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_warnings_session ON warnings(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_decisions_type ON decisions(type)`,
];

export function getDbPath(): string {
  const openrotDir = path.join(os.homedir(), '.openrot');
  if (!fs.existsSync(openrotDir)) {
    fs.mkdirSync(openrotDir, { recursive: true });
  }
  return path.join(openrotDir, 'sessions.db');
}

export function getDatabase(dbPath?: string): Database.Database {
  if (db) return db;

  const resolvedPath = dbPath || getDbPath();
  try {
    db = new Database(resolvedPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
    return db;
  } catch (error) {
    throw new Error(`Failed to open database at ${resolvedPath}: ${error}`);
  }
}

function runMigrations(database: Database.Database): void {
  const migrate = database.transaction(() => {
    for (const migration of MIGRATIONS) {
      database.exec(migration);
    }
  });
  migrate();
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/** Create a fresh in-memory database for testing */
export function createTestDatabase(): Database.Database {
  const testDb = new Database(':memory:');
  testDb.pragma('journal_mode = WAL');
  testDb.pragma('foreign_keys = ON');
  runMigrations(testDb);
  return testDb;
}

export { Database };
