import fs from 'fs';
import path from 'path';
import os from 'os';
import type { SessionState } from '../types.js';

const STATE_DIR = path.join(os.homedir(), '.openrot', 'state');

function ensureStateDir(): void {
  if (!fs.existsSync(STATE_DIR)) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
  }
}

function statePath(sessionId: string): string {
  const safe = sessionId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(STATE_DIR, `${safe}.json`);
}

/**
 * Load running session state for a hook session.
 * Returns a fresh state if none exists.
 */
export function loadState(sessionId: string): SessionState {
  try {
    const filePath = statePath(sessionId);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as SessionState;
    }
  } catch {
    // Corrupted state — start fresh
  }

  return createFreshState(sessionId);
}

/**
 * Save running session state to disk.
 */
export function saveState(state: SessionState): void {
  try {
    ensureStateDir();
    const filePath = statePath(state.sessionId);
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // Best-effort
  }
}

/**
 * Create a fresh session state.
 */
export function createFreshState(sessionId: string): SessionState {
  return {
    sessionId,
    startedAt: Date.now(),
    lastTurn: 0,
    decisions: [],
    fileReadCounts: {},
    fileEditCounts: {},
    consecutiveErrors: 0,
    errorPatterns: [],
    turnScores: [],
    rotPoint: null,
  };
}

/**
 * Delete session state.
 */
export function deleteState(sessionId: string): void {
  try {
    const filePath = statePath(sessionId);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {
    // Best-effort
  }
}

/**
 * List all session state files (for cleanup/status).
 */
export function listStates(): string[] {
  try {
    ensureStateDir();
    return fs.readdirSync(STATE_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''));
  } catch {
    return [];
  }
}
