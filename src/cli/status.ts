import chalk from 'chalk';
import { loadState, listStates } from '../state/index.js';
import { loadConfig, getConfigPath } from '../config/index.js';
import { detectEnvironment } from '../config/detect.js';

/**
 * openrot status — show current session health, recent scores, and config.
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

  // Session states
  try {
    const states = listStates();
    console.log(chalk.bold('Recent Sessions:'));

    if (states.length === 0) {
      console.log(chalk.dim('  No active sessions found.'));
    } else {
      const recentStates = states.slice(0, 5);
      for (const sessionId of recentStates) {
        const state = loadState(sessionId);
        const age = Math.round((Date.now() - state.startedAt) / 60000);
        const lastScore = state.turnScores[state.turnScores.length - 1];
        const scoreStr = lastScore ? `score: ${lastScore.score}%` : 'no score yet';

        let icon = '✅';
        if (lastScore && lastScore.score > 45) icon = '🔴';
        else if (lastScore && lastScore.score > 20) icon = '⚠️';

        console.log(`  ${icon} ${chalk.bold(sessionId.slice(0, 8))} — ${age}min ago, ${state.lastTurn} turns, ${scoreStr}`);

        if (state.decisions.length > 0) {
          const recent = state.decisions.slice(-3);
          for (const d of recent) {
            console.log(chalk.dim(`     [Turn ${d.turn}] ${d.commitment}`));
          }
          if (state.decisions.length > 3) {
            console.log(chalk.dim(`     ... and ${state.decisions.length - 3} more`));
          }
        }

        if (state.rotPoint) {
          console.log(chalk.red(`     Rot detected at turn ${state.rotPoint}`));
        }
      }

      if (states.length > 5) {
        console.log(chalk.dim(`\n  ... and ${states.length - 5} more sessions`));
      }
    }
  } catch {
    console.log(chalk.yellow('  ⚠️  Could not read session states'));
  }

  console.log('');

  // Editor detection
  try {
    const env = await detectEnvironment();
    console.log(chalk.bold('Editors:'));
    if (env.editors.claudeCode) console.log(chalk.green('  ✅ Claude Code'));
    if (env.editors.cursor) console.log(chalk.green('  ✅ Cursor'));
    if (env.editors.vscode) console.log(chalk.green('  ✅ VS Code'));
    if (env.editors.antigravity) console.log(chalk.green('  ✅ Google Antigravity'));
    if (!env.editors.claudeCode && !env.editors.cursor && !env.editors.vscode && !env.editors.antigravity) {
      console.log(chalk.dim('  (none detected)'));
    }
  } catch {
    console.log(chalk.yellow('  ⚠️  Could not detect editors'));
  }

  console.log('');
}
