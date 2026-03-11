import type { HandoffData } from '../types.js';

/**
 * Format handoff data into a structured handoff prompt.
 */
export function formatHandoff(data: HandoffData, target?: string): string {
  const lines: string[] = [
    '---',
    `Continuing a previous session on ${data.projectName}.`,
    '',
  ];

  if (data.decisions.length > 0) {
    lines.push('STACK DECISIONS:');
    for (const decision of data.decisions) {
      lines.push(`- ${decision}`);
    }
    lines.push('');
  }

  if (data.completed.length > 0) {
    lines.push('COMPLETED THIS SESSION:');
    for (const item of data.completed) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  if (data.inProgress.length > 0) {
    lines.push('IN PROGRESS:');
    for (const item of data.inProgress) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  if (data.unresolved.length > 0) {
    lines.push('UNRESOLVED:');
    for (const item of data.unresolved) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  const lastTask = data.inProgress[0] || data.completed[data.completed.length - 1] || 'the current task';
  lines.push(`Continue from ${lastTask}.`);
  lines.push('---');

  return lines.join('\n');
}

/**
 * Wrap handoff for a specific editor format.
 */
export function formatForEditor(handoff: string, editor: string): string {
  switch (editor) {
    case 'cursor':
      return `# Project Context (from OpenRot handoff)\n\n${handoff}`;
    case 'claude':
      return `# OpenRot Handoff — Session Context\n\n${handoff}`;
    case 'antigravity':
      return `# OpenRot Handoff — Session Context\n\n${handoff}`;
    case 'copilot':
      return `# Project Context (OpenRot handoff)\n\n${handoff}`;
    default:
      return handoff;
  }
}
