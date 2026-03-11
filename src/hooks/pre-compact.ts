import type { HookInput } from '../types.js';
import { getDb, saveToFile } from '../db/index.js';
import { parseTranscript, getAssistantMessages } from '../transcript/index.js';
import { extractDecisions } from '../extract/index.js';
import { DecisionStore } from '../db/decisions.js';
import { generateHandoff, saveHandoff } from '../handoff/index.js';
import { countTurns } from '../transcript/index.js';
import { getLogger } from '../logger.js';

const logger = getLogger();

/**
 * PreCompact hook handler — called before Claude Code compacts context.
 * 1. Read full transcript before compaction
 * 2. Extract all un-stored decisions
 * 3. Generate and save a handoff snapshot
 * 4. Output one-line notice to stderr
 */
export async function handlePreCompact(hookInput: HookInput): Promise<void> {
  try {
    const { session_id, transcript_path, cwd } = hookInput;

    const db = await getDb();
    const messages = parseTranscript(transcript_path);

    if (messages.length === 0) return;

    // Extract decisions from all messages that haven't been stored yet
    const decisionStore = new DecisionStore(db, saveToFile);
    const turn = countTurns(messages);
    const allTexts = getAssistantMessages(messages);

    let newDecisions = 0;
    for (const text of allTexts) {
      try {
        const extractions = await extractDecisions(text, {
          mode: 'regex',
          modelClient: null,
        });

        for (const extraction of extractions) {
          if (!decisionStore.isDuplicate(session_id, extraction.commitment)) {
            decisionStore.create(session_id, turn, extraction);
            newDecisions++;
          }
        }
      } catch {
        // Continue with next message
      }
    }

    // Generate and save handoff snapshot
    try {
      const projectName = cwd.split(/[\\/]/).pop() || 'unknown';
      const handoffPrompt = await generateHandoff(db, session_id, messages, projectName);
      if (handoffPrompt) {
        saveHandoff(db, session_id, cwd, handoffPrompt, saveToFile);
      }
    } catch {
      // Handoff generation failed
    }

    // Notify user
    process.stderr.write(
      `⚠️ OpenRot: Pre-compaction snapshot saved (${newDecisions} new decisions). Run 'openrot handoff' to use it.\n`,
    );

    logger.info('Pre-compact snapshot saved', {
      sessionId: session_id,
      cwd,
      newDecisions,
    });
  } catch (error) {
    logger.error('PreCompact hook error', { error: String(error) });
    // Fail silently
  }
}
