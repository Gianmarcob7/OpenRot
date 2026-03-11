import { Command } from 'commander';
import { startServer } from './server.js';
import { runInit } from './cli/init.js';
import { runConfig } from './cli/config.js';
import { runStatus } from './cli/status.js';
import { runTest } from './cli/test.js';
import { runModel } from './cli/model.js';
import { runInject } from './cli/inject.js';
import { getDatabase, closeDatabase } from './db/index.js';
import { SessionStore } from './db/sessions.js';
import chalk from 'chalk';

const program = new Command();

program
  .name('openrot')
  .description('Catches when AI contradicts decisions you\'ve already made')
  .version('0.1.0');

program
  .command('init')
  .description('Set up OpenRot (auto-detects your editor)')
  .action(async () => {
    try {
      await runInit();
    } catch (error) {
      console.error(chalk.red('Error during init:'), error);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Start the MCP server')
  .action(async () => {
    try {
      await startServer();
    } catch (error) {
      console.error(chalk.red('Error starting server:'), error);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('See what\'s been tracked')
  .action(async () => {
    try {
      await runStatus();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
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
  .option('--remove', 'Remove OpenRot instructions instead of injecting')
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
      const db = getDatabase();
      const sessionStore = new SessionStore(db);
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

      closeDatabase();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.parse();
