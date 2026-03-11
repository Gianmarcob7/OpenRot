import chalk from 'chalk';
import { getDb } from '../db/index.js';
import { DecisionStore } from '../db/decisions.js';
import { scanDirectory, scanFiles } from '../scan/index.js';
import type { ScanViolation } from '../types.js';

/**
 * openrot scan — scan codebase against stored decisions.
 */
export async function runScan(options: { path?: string; files?: boolean }): Promise<void> {
  try {
    const db = await getDb();
    const decisionStore = new DecisionStore(db);
    const decisions = decisionStore.getAll();

    if (decisions.length === 0) {
      console.log(chalk.dim('No decisions stored. Start a coding session first.'));
      return;
    }

    let violations: ScanViolation[];

    if (options.files) {
      // Read file list from stdin (for pre-commit hook integration)
      const input = await readStdin();
      const files = input.split('\n').map((f) => f.trim()).filter((f) => f.length > 0);
      violations = scanFiles(files, decisions);
    } else {
      const scanPath = options.path || process.cwd();
      console.log(chalk.dim(`Scanning ${scanPath} against ${decisions.length} decisions...\n`));
      violations = scanDirectory(scanPath, decisions);
    }

    if (violations.length === 0) {
      console.log(chalk.green('✅ No violations found'));
      process.exit(0);
      return;
    }

    console.log(chalk.bold('━'.repeat(60)));
    console.log(chalk.bold(`OpenRot Scan — ${violations.length} violation${violations.length > 1 ? 's' : ''} found\n`));

    for (const v of violations) {
      const icon = '❌';
      const loc = v.line > 0 ? `${v.filePath}:${v.line}` : v.filePath;
      console.log(chalk.red(`${icon} ${loc}`));
      console.log(chalk.dim(`   Decision: "${v.decision}"`));
      console.log(chalk.dim(`   Found: ${v.found}`));
      console.log('');
    }

    console.log(chalk.bold('━'.repeat(60)));

    // Exit with code 1 when used from pre-commit hook
    if (options.files) {
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('Scan failed:'), error);
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    if (process.stdin.isTTY) {
      resolve('');
      return;
    }
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => { resolve(data); });
    process.stdin.resume();
  });
}
