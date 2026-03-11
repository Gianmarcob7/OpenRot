import chalk from 'chalk';
import { getDb } from '../db/index.js';
import { SessionStore } from '../db/sessions.js';
import { DecisionStore } from '../db/decisions.js';
import { WarningStore } from '../db/warnings.js';
import { getLatestRotScore } from '../scoring/index.js';
import path from 'path';
import os from 'os';
import fs from 'fs';

/**
 * openrot recap — generate session summary/journal entry.
 */
export async function runRecap(): Promise<void> {
  try {
    const db = await getDb();
    const sessionStore = new SessionStore(db);
    const decisionStore = new DecisionStore(db);
    const warningStore = new WarningStore(db);

    // Get latest session
    const sessions = sessionStore.getAll();
    if (sessions.length === 0) {
      console.log(chalk.dim('No sessions found.'));
      return;
    }

    const session = sessions[0];
    const decisions = decisionStore.getBySessionId(session.id);
    const warnings = warningStore.getBySessionId(session.id);
    const latestScore = getLatestRotScore(db, session.id);

    // Calculate duration
    const endTime = session.endedAt || Date.now();
    const durationMs = endTime - session.createdAt;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    const date = new Date(session.createdAt).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });

    const projectName = path.basename(process.cwd());
    const editor = session.editor || 'Unknown';
    const scoreStr = latestScore
      ? `${latestScore.combined}% (${latestScore.level})`
      : 'N/A';

    // Build recap
    const recap = [
      '━'.repeat(60),
      `Session Recap — ${date}`,
      `Project: ${projectName} · Tool: ${editor} · Duration: ${duration}`,
      `Final Rot Score: ${scoreStr}`,
      '',
      `Decisions made: ${decisions.length}`,
    ];

    for (let i = 0; i < decisions.length; i++) {
      recap.push(`${i + 1}. ${decisions[i].commitment}`);
    }

    if (warnings.length > 0) {
      recap.push('');
      recap.push('Warnings:');
      for (const w of warnings) {
        const d = decisionStore.getById(w.priorDecisionId);
        recap.push(`- Turn ${w.currentTurn}: ${d ? d.commitment : 'unknown'} contradiction (${Math.round(w.confidence * 100)}%)`);
      }
    }

    recap.push('━'.repeat(60));

    const recapText = recap.join('\n');
    console.log('\n' + recapText + '\n');

    // Save to journal
    try {
      const journalDir = path.join(os.homedir(), '.openrot', 'journal');
      if (!fs.existsSync(journalDir)) {
        fs.mkdirSync(journalDir, { recursive: true });
      }

      const isoDate = new Date(session.createdAt).toISOString().split('T')[0];
      const filename = `${isoDate}-${projectName}.md`;
      const journalPath = path.join(journalDir, filename);
      fs.writeFileSync(journalPath, recapText, 'utf-8');
      console.log(chalk.dim(`Saved to ${journalPath}`));
    } catch {
      // Fail silently
    }
  } catch (error) {
    console.error(chalk.red('Recap failed:'), error);
  }
}
