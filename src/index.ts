import { Command } from 'commander';
import chalk from 'chalk';
import { startServer } from './server.js';
import { runInit } from './cli/init.js';
import { runConfig } from './cli/config.js';
import { runStatus } from './cli/status.js';
import { runTest } from './cli/test.js';
import { runModel } from './cli/model.js';
import { runInject } from './cli/inject.js';
import { runHandoff } from './cli/handoff.js';
import { runScan } from './cli/scan.js';
import { runGuard } from './cli/guard.js';
import { runSync } from './cli/sync.js';
import { runRecap } from './cli/recap.js';
import { handleAnalyze, readHookInput } from './hooks/analyze.js';
import { handleSessionStart } from './hooks/session-start.js';
import { handlePreCompact } from './hooks/pre-compact.js';
import { getDb, closeDb, saveToFile } from './db/index.js';
import { SessionStore } from './db/sessions.js';
import { getLogger } from './logger.js';

const program = new Command();

program
  .name('openrot')
  .description('Real-time AI session health scoring. Detects when output quality is degrading.')
  .version('2.0.0');

// ── Hook commands (called by Claude Code automatically) ──────

program
  .command('analyze')
  .description('Stop hook — score session health (called by Claude Code)')
  .action(async () => {
    try {
      const input = await readHookInput();
      await handleAnalyze(input);
    } catch (error) {
      getLogger().error('analyze failed', { error: String(error) });
      // Always exit 0 — never block the session
    }
    process.exit(0);
  });

program
  .command('session-start')
  .description('SessionStart hook — initialize session (called by Claude Code)')
  .action(async () => {
    try {
      const input = await readHookInput();
      await handleSessionStart(input);
    } catch (error) {
      getLogger().error('session-start failed', { error: String(error) });
    }
    process.exit(0);
  });

program
  .command('pre-compact')
  .description('PreCompact hook — save snapshot before context compaction')
  .action(async () => {
    try {
      const input = await readHookInput();
      await handlePreCompact(input);
    } catch (error) {
      getLogger().error('pre-compact failed', { error: String(error) });
    }
    process.exit(0);
  });

// ── User-facing commands ─────────────────────────────────────

program
  .command('init')
  .description('Set up OpenRot (auto-detects editors, registers hooks)')
  .action(async () => {
    try {
      await runInit();
    } catch (error) {
      console.error(chalk.red('Error during init:'), error);
      process.exit(1);
    }
  });

program
  .command('handoff')
  .description('Generate fresh start prompt from current/last session')
  .option('--for <editor>', 'Save to editor file (claude, cursor, antigravity, copilot)')
  .action(async (options) => {
    try {
      await runHandoff(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('sync')
  .description('Sync decisions to all editor instruction files')
  .action(async () => {
    try {
      await runSync();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('scan')
  .description('Scan codebase against stored decisions')
  .argument('[path]', 'Path to scan (default: current directory)')
  .option('--files', 'Read file list from stdin (for pre-commit hook)')
  .action(async (scanPath, options) => {
    try {
      await runScan({ path: scanPath, ...options });
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('guard')
  .description('Install/remove pre-commit hook')
  .option('--install', 'Install pre-commit hook (default)')
  .option('--remove', 'Remove pre-commit hook')
  .action((options) => {
    try {
      runGuard(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('recap')
  .description('Generate session summary/journal entry')
  .action(async () => {
    try {
      await runRecap();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show current session health and decisions')
  .action(async () => {
    try {
      await runStatus();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Start the MCP server (for Cursor/VS Code/Antigravity)')
  .action(async () => {
    try {
      await startServer();
    } catch (error) {
      console.error(chalk.red('Error starting server:'), error);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Change settings')
  .action(async () => {
    try {
      await runConfig();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('test')
  .description('Verify everything works')
  .action(async () => {
    try {
      await runTest();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('model')
  .description('Switch model provider and model')
  .option('--provider <provider>', 'Provider: ollama, openai, anthropic, gemini, regex')
  .option('--model <model>', 'Model name')
  .option('--key <key>', 'API key')
  .action(async (options) => {
    try {
      await runModel(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('inject')
  .description('Inject/remove OpenRot instructions into editor instruction files')
  .option('--remove', 'Remove OpenRot instructions')
  .action(async (options) => {
    try {
      await runInject(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('reset')
  .description('Clear session data')
  .option('--hard', 'Also clear configuration')
  .action(async (options) => {
    try {
      const db = await getDb();
      const sessionStore = new SessionStore(db, saveToFile);
      sessionStore.deleteAll();
      console.log(chalk.green('✅ Session data cleared.'));

      if (options.hard) {
        const fs = await import('fs');
        const path = await import('path');
        const os = await import('os');
        const configPath = path.join(os.homedir(), '.openrot', 'config.json');
        if (fs.existsSync(configPath)) {
          fs.unlinkSync(configPath);
          console.log(chalk.green('✅ Configuration cleared.'));
        }
      }

      closeDb();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.parse();
