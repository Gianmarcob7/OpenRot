import chalk from 'chalk';
import { getDatabase } from '../db/index.js';
import { SessionStore } from '../db/sessions.js';
import { DecisionStore } from '../db/decisions.js';
import { WarningStore } from '../db/warnings.js';
import { loadConfig, getConfigPath } from '../config/index.js';
import { detectEnvironment } from '../config/detect.js';

/**
 * openrot status — show current session info, decisions, warnings, and config.
 */
export async function runStatus(): Promise<void> {
  console.log(chalk.bold('\n📊 OpenRot — Status\n'));

  // Config
  try {
    const config = await loadConfig();
    const configPath = getConfigPath();
    console.log(chalk.bold('Configuration:'));
    console.log(`  Config file: ${chalk.dim(configPath)}`);
    console.log(`  Extraction mode: ${chalk.cyan(config.extraction.mode)}`);
    console.log(`  Sensitivity: ${chalk.cyan(config.sensitivity)}`);
    console.log(`  Threshold: ${chalk.cyan(String(config.threshold))}`);
  } catch {
    console.log(chalk.yellow('  ⚠️  Could not load config'));
  }

  console.log('');

  // Database
  try {
    const db = getDatabase();
    const sessionStore = new SessionStore(db);
    const decisionStore = new DecisionStore(db);
    const warningStore = new WarningStore(db);

    const sessions = sessionStore.getAll();

    console.log(chalk.bold('Sessions:'));
    if (sessions.length === 0) {
      console.log(chalk.dim('  No sessions found.'));
    } else {
      const recentSessions = sessions.slice(0, 5);
      for (const session of recentSessions) {
        const decisions = decisionStore.getBySessionId(session.id);
        const warnings = warningStore.getBySessionId(session.id);
        const age = Math.round((Date.now() - session.createdAt) / 60000);

        console.log(`  ${chalk.dim(session.id.slice(0, 8))} — ${age}min ago`);
        console.log(`    Decisions: ${decisions.length}, Warnings: ${warnings.length}`);

        if (decisions.length > 0) {
          const recent = decisions.slice(-3);
          for (const d of recent) {
            console.log(`    ${chalk.dim(`[Turn ${d.turn}]`)} ${d.commitment}`);
          }
          if (decisions.length > 3) {
            console.log(chalk.dim(`    ... and ${decisions.length - 3} more`));
          }
        }
      }

      if (sessions.length > 5) {
        console.log(chalk.dim(`\n  ... and ${sessions.length - 5} more sessions`));
      }
    }
  } catch {
    console.log(chalk.yellow('  ⚠️  Could not read database'));
  }

  console.log('');

  // Editor detection
  try {
    const env = await detectEnvironment();
    console.log(chalk.bold('Editors:'));
    if (env.editors.claudeCode) console.log(chalk.green('  ✅ Claude Code'));
    if (env.editors.cursor) console.log(chalk.green('  ✅ Cursor'));
    if (env.editors.vscode) console.log(chalk.green('  ✅ VS Code'));
    if (!env.editors.claudeCode && !env.editors.cursor && !env.editors.vscode) {
      console.log(chalk.dim('  (none detected)'));
    }
  } catch {
    console.log(chalk.yellow('  ⚠️  Could not detect editors'));
  }

  console.log('');
}
