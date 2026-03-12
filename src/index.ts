import { Command } from 'commander';
import chalk from 'chalk';
import { startServer } from './server.js';
import { runInit } from './cli/init.js';
import { runConfig } from './cli/config.js';
import { runStatus } from './cli/status.js';
import { runTest } from './cli/test.js';
import { runModel } from './cli/model.js';
import { runScan } from './cli/scan.js';
import { runFix } from './cli/fix.js';
import { handleAnalyze, readHookInput } from './hooks/analyze.js';
import { handleSessionStart } from './hooks/session-start.js';
import { handlePreCompact } from './hooks/pre-compact.js';
import { getLogger } from './logger.js';

const program = new Command();

program
  .name('openrot')
  .description('A linter for your AI context window. Detects when session quality is degrading.')
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

// ── Core user-facing commands ────────────────────────────────

program
  .command('scan')
  .description('Analyze session transcript(s) for context degradation')
  .argument('[path]', 'Path to transcript file or directory')
  .action(async (scanPath) => {
    try {
      await runScan({ path: scanPath });
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('fix')
  .description('Generate fresh start prompt with all context preserved')
  .option('--session <id>', 'Target a specific session')
  .action(async (options) => {
    try {
      await runFix(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

// ── Setup & configuration commands ───────────────────────────

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

program.parse();
