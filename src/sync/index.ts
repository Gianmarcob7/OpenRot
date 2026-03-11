import type { Database } from 'sql.js';
import { DecisionStore } from '../db/decisions.js';
import { writeDecisions, getProjectWriterTargets } from './writers.js';

/**
 * Sync decisions from the database to all editor instruction files for a project.
 */
export async function syncDecisionsToProject(
  db: Database,
  projectPath: string,
): Promise<{ synced: string[]; failed: string[] }> {
  const synced: string[] = [];
  const failed: string[] = [];

  try {
    // Get all decisions for this project
    const decisionStore = new DecisionStore(db);
    const decisions = decisionStore.getAllForProject(projectPath);
    const commitments = decisions.map((d) => d.commitment);

    if (commitments.length === 0) {
      return { synced, failed };
    }

    // Write to all editor targets
    const targets = getProjectWriterTargets(projectPath);

    for (const target of targets) {
      const result = writeDecisions(target, commitments);
      if (result === 'error') {
        failed.push(target.label);
      } else {
        synced.push(target.label);
      }
    }
  } catch {
    // Fail silently
  }

  return { synced, failed };
}

/**
 * Sync all decisions across all sessions (global sync).
 */
export async function syncAllDecisions(
  db: Database,
  projectPath: string,
): Promise<{ synced: string[]; failed: string[] }> {
  return syncDecisionsToProject(db, projectPath);
}
