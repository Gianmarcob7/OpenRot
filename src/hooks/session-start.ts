import type { HookInput } from '../types.js';
import { getDb, saveToFile } from '../db/index.js';
import { SessionStore } from '../db/sessions.js';
import { syncDecisionsToProject } from '../sync/index.js';
import { getLogger } from '../logger.js';

const logger = getLogger();

/**
 * SessionStart hook handler — called when Claude Code starts a new session.
 * 1. Create a new session in DB
 * 2. Sync decisions from DB into editor instruction files for this project
 */
export async function handleSessionStart(hookInput: HookInput): Promise<void> {
  try {
    const { session_id, cwd } = hookInput;

    const db = await getDb();
    const sessionStore = new SessionStore(db, saveToFile);

    // Create a new session
    const session = sessionStore.create('claude_code');

    // Sync existing decisions for this project into CLAUDE.md
    try {
      await syncDecisionsToProject(db, cwd);
    } catch {
      // Sync failed — continue without it
    }

    logger.info('Session started via hook', {
      sessionId: session.id,
      hookSessionId: session_id,
      cwd,
    });
  } catch (error) {
    logger.error('SessionStart hook error', { error: String(error) });
    // Fail silently
  }
}
