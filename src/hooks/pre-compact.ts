import type { HookInput } from '../types.js';
import { parseTranscript, getAssistantMessages, countTurns } from '../transcript/index.js';
import { analyzeTranscript } from '../detect/index.js';
import { extractWithRegex } from '../extract/regex.js';
import { loadState, saveState } from '../state/index.js';
import { getLogger } from '../logger.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

const logger = getLogger();

/**
 * PreCompact hook handler — called before Claude Code compacts context.
 * 1. Read full transcript before compaction
 * 2. Run detection analysis to snapshot current state
 * 3. Extract all decisions and save snapshot
 * 4. Output preservation notice to stderr
 */
export async function handlePreCompact(hookInput: HookInput): Promise<void> {
  try {
    const { session_id, transcript_path, cwd } = hookInput;

    const messages = parseTranscript(transcript_path);
    if (messages.length === 0) return;

    // Run full analysis
    const result = analyzeTranscript(messages);
    const { score } = result;

    // Extract decisions from all assistant messages
    const assistantTexts = getAssistantMessages(messages);
    const decisions: string[] = [];
    const seen = new Set<string>();
    for (const text of assistantTexts) {
      const extracted = extractWithRegex(text);
      for (const e of extracted) {
        const normalized = e.commitment.toLowerCase();
        if (!seen.has(normalized)) {
          seen.add(normalized);
          decisions.push(e.commitment);
        }
      }
    }

    // Update state with all decisions
    const state = loadState(session_id);
    state.decisions = decisions.map((d, i) => ({
      turn: i + 1,
      commitment: d,
    }));
    state.lastTurn = countTurns(messages);
    if (score.rotPoint && !state.rotPoint) {
      state.rotPoint = score.rotPoint;
    }
    saveState(state);

    // Save snapshot to disk
    const snapshotDir = path.join(os.homedir(), '.openrot', 'snapshots');
    if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir, { recursive: true });
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotPath = path.join(snapshotDir, `${date}-${session_id.substring(0, 8)}.json`);
    fs.writeFileSync(snapshotPath, JSON.stringify({
      sessionId: session_id,
      cwd,
      turn: state.lastTurn,
      score: score.combined,
      level: score.level,
      rotPoint: score.rotPoint,
      decisions,
      timestamp: new Date().toISOString(),
    }, null, 2), 'utf-8');

    // Notify user
    const decisionCount = decisions.length;
    const levelMsg = score.level === 'healthy'
      ? ''
      : ` Session health: ${score.combined}%.`;
    process.stderr.write(
      `⚠️ OpenRot: Pre-compaction snapshot saved (${decisionCount} decisions).${levelMsg} Run 'openrot fix' to generate handoff.\n`,
    );

    logger.info('Pre-compact snapshot saved', {
      sessionId: session_id,
      cwd,
      decisions: decisionCount,
      score: score.combined,
    });
  } catch (error) {
    logger.error('PreCompact hook error', { error: String(error) });
  }
}
