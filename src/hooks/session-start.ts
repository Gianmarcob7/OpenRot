import type { HookInput } from '../types.js';
import { createFreshState, saveState } from '../state/index.js';
import { getLogger } from '../logger.js';

const logger = getLogger();

/**
 * SessionStart hook handler — called when Claude Code starts a new session.
 * Creates fresh session state and sets quality baselines.
 */
export async function handleSessionStart(hookInput: HookInput): Promise<void> {
  try {
    const { session_id, cwd } = hookInput;

    // Create fresh session state
    const state = createFreshState(session_id);
    saveState(state);

    logger.info('Session started via hook', {
      sessionId: session_id,
      cwd,
    });
  } catch (error) {
    logger.error('SessionStart hook error', { error: String(error) });
  }
}
