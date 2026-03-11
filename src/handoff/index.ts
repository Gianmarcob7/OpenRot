import type { Database } from 'sql.js';
import type { TranscriptMessage } from '../types.js';
import { DecisionStore } from '../db/decisions.js';
import { extractHandoffData } from './extractor.js';
import { formatHandoff, formatForEditor } from './formatter.js';
import { EDITOR_FILE_NAMES } from './templates.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import os from 'os';
import fs from 'fs';

/**
 * Generate a handoff prompt from the current session.
 * Returns the formatted handoff text.
 */
export async function generateHandoff(
  db: Database,
  sessionId: string,
  messages: TranscriptMessage[],
  projectName: string,
): Promise<string> {
  const decisionStore = new DecisionStore(db);

  // Get decisions for this session
  const decisionRows = decisionStore.getBySessionId(sessionId);
  const decisions = decisionRows.map((d) => d.commitment);

  // Extract progress data from transcript
  const handoffData = extractHandoffData(messages, decisions, projectName);

  return formatHandoff(handoffData);
}

/**
 * Save a handoff to the database and to disk.
 */
export function saveHandoff(
  db: Database,
  sessionId: string,
  projectPath: string,
  prompt: string,
  saveFn: () => void = () => {},
): void {
  try {
    // Save to database
    db.run(
      'INSERT INTO handoffs (id, session_id, project_path, prompt, created_at) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), sessionId, projectPath, prompt, Date.now()],
    );
    saveFn();

    // Save to disk
    const handoffDir = path.join(os.homedir(), '.openrot', 'handoffs');
    if (!fs.existsSync(handoffDir)) {
      fs.mkdirSync(handoffDir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    const projectSlug = projectPath.split(/[\\/]/).pop() || 'unknown';
    const filename = `${date}-${projectSlug}.md`;
    fs.writeFileSync(path.join(handoffDir, filename), prompt, 'utf-8');
  } catch {
    // Fail silently
  }
}

/**
 * Save handoff to an editor-specific instruction file.
 */
export function saveHandoffForEditor(
  prompt: string,
  editor: string,
  projectPath: string,
): string | null {
  try {
    const formatted = formatForEditor(prompt, editor);
    const fileName = EDITOR_FILE_NAMES[editor];
    if (!fileName) return null;

    const filePath = path.join(projectPath, fileName);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, formatted, 'utf-8');
    return filePath;
  } catch {
    return null;
  }
}

/**
 * Get the most recent handoff for a project.
 */
export function getLatestHandoff(
  db: Database,
  projectPath: string,
): string | null {
  try {
    const results = db.exec(
      'SELECT prompt FROM handoffs WHERE project_path = ? ORDER BY created_at DESC LIMIT 1',
      [projectPath],
    );
    if (!results.length || !results[0].values.length) return null;
    return results[0].values[0][0] as string;
  } catch {
    return null;
  }
}
