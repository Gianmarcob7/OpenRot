import chalk from 'chalk';
import { getDb } from '../db/index.js';
import { syncDecisionsToProject } from '../sync/index.js';

/**
 * openrot sync — sync decisions to all detected editor instruction files.
 */
export async function runSync(): Promise<void> {
  try {
    const cwd = process.cwd();
    const db = await getDb();

    console.log(chalk.bold('\n🔄 OpenRot — Syncing Decisions\n'));
    console.log(chalk.dim(`Project: ${cwd}\n`));

    const { synced, failed } = await syncDecisionsToProject(db, cwd);

    if (synced.length === 0 && failed.length === 0) {
      console.log(chalk.dim('No decisions to sync.'));
    } else {
      for (const label of synced) {
        console.log(chalk.green(`  ✅ ${label}`));
      }
      for (const label of failed) {
        console.log(chalk.yellow(`  ⚠️  ${label} — failed`));
      }
    }

    console.log('');
  } catch (error) {
    console.error(chalk.red('Sync failed:'), error);
  }
}
