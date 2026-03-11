import fs from 'fs';
import path from 'path';
import os from 'os';

const MARKER_START = '<!-- openrot-decisions-start -->';
const MARKER_END = '<!-- openrot-decisions-end -->';

interface WriterTarget {
  label: string;
  /** Path to the instruction file (relative to project or global) */
  filePath: string;
}

/**
 * Write decisions to an instruction file using markers.
 * Replaces existing OpenRot section or appends if not present.
 */
export function writeDecisions(target: WriterTarget, decisions: string[]): 'created' | 'updated' | 'error' {
  try {
    const { filePath } = target;
    const block = buildDecisionBlock(decisions);

    // Ensure parent directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');

      if (content.includes(MARKER_START)) {
        // Replace existing block
        const regex = new RegExp(
          `${escapeRegExp(MARKER_START)}[\\s\\S]*?${escapeRegExp(MARKER_END)}`,
          'g',
        );
        const updated = content.replace(regex, block);
        fs.writeFileSync(filePath, updated, 'utf-8');
        return 'updated';
      }

      // Append
      const separator = content.endsWith('\n') ? '\n' : '\n\n';
      fs.writeFileSync(filePath, content + separator + block + '\n', 'utf-8');
      return 'updated';
    }

    // Create new
    fs.writeFileSync(filePath, block + '\n', 'utf-8');
    return 'created';
  } catch {
    return 'error';
  }
}

/**
 * Build the decisions markdown block with markers.
 */
function buildDecisionBlock(decisions: string[]): string {
  const lines = [
    MARKER_START,
    '## Project Decisions (managed by OpenRot)',
  ];

  for (const decision of decisions) {
    lines.push(`- ${decision}`);
  }

  lines.push(MARKER_END);
  return lines.join('\n');
}

/**
 * Get writer targets for a project path.
 * Returns instruction file paths for all supported editors.
 */
export function getProjectWriterTargets(projectPath: string): WriterTarget[] {
  return [
    { label: 'Claude Code', filePath: path.join(projectPath, 'CLAUDE.md') },
    { label: 'Cursor', filePath: path.join(projectPath, '.cursorrules') },
    { label: 'Copilot', filePath: path.join(projectPath, '.github', 'copilot-instructions.md') },
    { label: 'Antigravity', filePath: path.join(projectPath, 'AGENT.md') },
  ];
}

/**
 * Get global writer targets (editor-level instruction files).
 */
export function getGlobalWriterTargets(): WriterTarget[] {
  const homeDir = os.homedir();
  const platform = os.platform();
  const targets: WriterTarget[] = [];

  // Claude Code global
  targets.push({ label: 'Claude Code', filePath: path.join(homeDir, '.claude', 'CLAUDE.md') });

  // Cursor global
  const cursorDir = path.join(homeDir, '.cursor');
  if (fs.existsSync(cursorDir)) {
    targets.push({ label: 'Cursor', filePath: path.join(cursorDir, 'CURSOR.md') });
  }

  return targets;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export { MARKER_START, MARKER_END };
