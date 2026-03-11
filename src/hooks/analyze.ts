import type { HookInput } from '../types.js';
import { getDb, saveToFile } from '../db/index.js';
import { parseTranscript } from '../transcript/index.js';
import { computeRotScore, formatRotOutput, saveRotScore } from '../scoring/index.js';
import { extractDecisions } from '../extract/index.js';
import { DecisionStore } from '../db/decisions.js';
import { getAssistantMessages, countTurns } from '../transcript/index.js';
import { getLogger } from '../logger.js';

const logger = getLogger();

// Track last score output to avoid repeating warnings on consecutive turns
let lastOutputSessionId: string | null = null;
let lastOutputLevel: string | null = null;

/**
 * Stop hook handler — called after every Claude Code response.
 * Reads JSON from stdin, scores the session, outputs warnings.
 * MUST complete in <5 seconds.
 */
export async function handleAnalyze(hookInput: HookInput): Promise<void> {
  try {
    const { session_id, transcript_path, cwd } = hookInput;

    // Parse transcript
    const messages = parseTranscript(transcript_path);
    if (messages.length === 0) return;

    // Initialize database
    const db = await getDb();
    const turn = countTurns(messages);

    // Extract decisions from last assistant message
    try {
      const assistantTexts = getAssistantMessages(messages);
      const lastResponse = assistantTexts[assistantTexts.length - 1];
      if (lastResponse) {
        const decisionStore = new DecisionStore(db, saveToFile);
        const extractions = await extractDecisions(lastResponse, {
          mode: 'regex',
          modelClient: null,
        });

        for (const extraction of extractions) {
          if (!decisionStore.isDuplicate(session_id, extraction.commitment)) {
            decisionStore.create(session_id, turn, extraction);
          }
        }
      }
    } catch {
      // Decision extraction failed — continue with scoring
    }

    // Compute rot score
    const score = computeRotScore(db, session_id, messages);

    // Save to database
    saveRotScore(db, session_id, score, saveToFile);

    // Format output
    const output = formatRotOutput(score);

    if (!output) {
      // Green, score < 15 — silent
      return;
    }

    // Avoid repeating the same warning level on consecutive turns
    if (
      lastOutputSessionId === session_id &&
      lastOutputLevel === score.level &&
      score.level !== 'red' // Always show red
    ) {
      return;
    }

    lastOutputSessionId = session_id;
    lastOutputLevel = score.level;

    if (output.stdout) {
      process.stdout.write(output.stdout);
    }

    if (output.stderr) {
      process.stderr.write(output.stderr + '\n');
    }

    logger.info('Rot score computed', {
      sessionId: session_id,
      turn,
      score: score.combined,
      level: score.level,
    });
  } catch (error) {
    logger.error('Analyze hook error', { error: String(error) });
    // Fail silently — never crash, never exit non-zero
  }
}

/**
 * Read hook input from stdin.
 */
export function readHookInput(): Promise<HookInput> {
  return new Promise((resolve, reject) => {
    let data = '';

    // Set a timeout to avoid hanging forever
    const timeout = setTimeout(() => {
      reject(new Error('Timeout reading stdin'));
    }, 3000);

    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });

    process.stdin.on('end', () => {
      clearTimeout(timeout);
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON on stdin'));
      }
    });

    process.stdin.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    process.stdin.resume();
  });
}
