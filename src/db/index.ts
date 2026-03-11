import initSqlJs, { type Database } from 'sql.js';
import path from 'path';
import os from 'os';
import fs from 'fs';

let db: Database | null = null;
let dbFilePath: string | null = null;

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
    tool TEXT DEFAULT 'claude_code',
    project_path TEXT,
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
  `CREATE TABLE IF NOT EXISTS rot_scores (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    turn INTEGER,
    contradiction_score REAL,
    repetition_score REAL,
    saturation_score REAL,
    combined_score REAL,
    created_at INTEGER,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  )`,
  `CREATE TABLE IF NOT EXISTS handoffs (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    project_path TEXT,
    prompt TEXT,
    created_at INTEGER,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_decisions_session ON decisions(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_warnings_session ON warnings(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_decisions_type ON decisions(type)`,
  `CREATE INDEX IF NOT EXISTS idx_rot_scores_session ON rot_scores(session_id)`,
];

export function getDbPath(): string {
  const openrotDir = path.join(os.homedir(), '.openrot');
  if (!fs.existsSync(openrotDir)) {
    fs.mkdirSync(openrotDir, { recursive: true });
  }
  return path.join(openrotDir, 'sessions.db');
}

export async function getDb(overridePath?: string): Promise<Database> {
  if (db) return db;

  const resolvedPath = overridePath || getDbPath();
  try {
    const SQL = await initSqlJs();

    if (fs.existsSync(resolvedPath)) {
      const fileBuffer = fs.readFileSync(resolvedPath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }

    db.run('PRAGMA journal_mode = WAL');
    db.run('PRAGMA foreign_keys = ON');
    dbFilePath = resolvedPath;
    runMigrations(db);
    saveToFile();
    return db;
  } catch (error) {
    throw new Error(`Failed to open database at ${resolvedPath}: ${error}`);
  }
}

function runMigrations(database: Database): void {
  for (const migration of MIGRATIONS) {
    database.run(migration);
  }
}

/** Persist the current database state to disk */
export function saveToFile(): void {
  if (db && dbFilePath) {
    const data = db.export();
    fs.writeFileSync(dbFilePath, Buffer.from(data));
  }
}

export function closeDb(): void {
  if (db) {
    saveToFile();
    db.close();
    db = null;
    dbFilePath = null;
  }
}

/** Create a fresh in-memory database for testing */
export async function createTestDatabase(): Promise<Database> {
  const SQL = await initSqlJs();
  const testDb = new SQL.Database();
  testDb.run('PRAGMA foreign_keys = ON');
  runMigrations(testDb);
  return testDb;
}

export type { Database };
