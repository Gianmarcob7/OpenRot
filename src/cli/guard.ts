import chalk from 'chalk';
import { installGuard, removeGuard } from '../scan/guard.js';

/**
 * openrot guard — install/remove pre-commit hook.
 */
export function runGuard(options: { install?: boolean; remove?: boolean }): void {
  const projectPath = process.cwd();

  if (options.remove) {
    const result = removeGuard(projectPath);
    if (result.success) {
      console.log(chalk.green(`✅ ${result.message}`));
    } else {
      console.log(chalk.red(`❌ ${result.message}`));
    }
    return;
  }

  // Default: install
  const result = installGuard(projectPath);
  if (result.success) {
    console.log(chalk.green(`✅ ${result.message}`));
    console.log(chalk.dim('   Bypass with: git commit --no-verify'));
  } else {
    console.log(chalk.red(`❌ ${result.message}`));
  }
}
