/**
 * Template strings for handoff prompts.
 */

export const HANDOFF_HEADER = '---';
export const HANDOFF_FOOTER = '---';

export const SECTION_HEADERS = {
  decisions: 'STACK DECISIONS:',
  completed: 'COMPLETED THIS SESSION:',
  inProgress: 'IN PROGRESS:',
  unresolved: 'UNRESOLVED:',
};

export const EDITOR_FILE_NAMES: Record<string, string> = {
  claude: 'CLAUDE.md',
  cursor: '.cursorrules',
  antigravity: 'AGENT.md',
  copilot: '.github/copilot-instructions.md',
};
