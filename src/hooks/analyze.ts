import type { HookInput } from '../types.js';
import { tailTranscript } from '../transcript/tail.js';
import { countTurns } from '../transcript/index.js';
import { analyzeTranscript, getRotLevel } from '../detect/index.js';
import { loadState, saveState } from '../state/index.js';
import { getLogger } from '../logger.js';

const logger = getLogger();

/**
 * Stop hook handler — called after every Claude Code response.
 * Reads JSON from stdin, scores the session, outputs warnings.
 * MUST complete in <5 seconds. Uses tail-reading + cached state.
 */
export async function handleAnalyze(hookInput: HookInput): Promise<void> {
  const startTime = Date.now();

  try {
    const { session_id, transcript_path } = hookInput;

    // Tail-read only last 20 turns for speed
    const messages = tailTranscript(transcript_path, 40);
    if (messages.length === 0) return;

    const totalTurns = countTurns(messages);

    // Load running state
    const state = loadState(session_id);

    // Skip if we already analyzed this turn
    if (state.lastTurn >= totalTurns && totalTurns > 0) return;

    // Analyze the recent messages
    const result = analyzeTranscript(messages);
    const { score, signals } = result;

    // Update state
    state.lastTurn = totalTurns;
    state.turnScores.push({ turn: totalTurns, score: score.combined });
    if (score.rotPoint && !state.rotPoint) {
      state.rotPoint = score.rotPoint;
    }

    // Bail if taking too long (safety valve)
    if (Date.now() - startTime > 4000) {
      saveState(state);
      return;
    }

    saveState(state);

    // Output based on level
    if (score.level === 'healthy') {
      // Silent
      return;
    }

    if (score.level === 'degrading') {
      const topSignal = signals.filter((s) => s.score >= 40)[0];
      const detail = topSignal ? ` — ${topSignal.description.toLowerCase()}` : '';
      process.stderr.write(
        `⚠️ OpenRot: Session degrading (${score.combined}%)${detail}\n`,
      );
    }

    if (score.level === 'rotted') {
      const rotInfo = score.rotPoint ? ` — quality dropped at turn ${score.rotPoint}` : '';
      process.stderr.write(
        `🔴 OpenRot: Session rotted (${score.combined}%)${rotInfo}. Run: openrot fix\n`,
      );
    }

    logger.info('Rot score computed', {
      sessionId: session_id,
      turn: totalTurns,
      score: score.combined,
      level: score.level,
      elapsed: Date.now() - startTime,
    });
  } catch (error) {
    logger.error('Analyze hook error', { error: String(error) });
  }
}

/**
 * Read hook input from stdin.
 */
export function readHookInput(): Promise<HookInput> {
  return new Promise((resolve, reject) => {
    let data = '';

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
