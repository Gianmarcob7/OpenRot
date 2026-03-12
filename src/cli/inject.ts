import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';

const MARKER_START = '<!-- openrot-start -->';
const MARKER_END = '<!-- openrot-end -->';

const INSTRUCTIONS_BLOCK = `${MARKER_START}
## OpenRot — Session Health Monitor
OpenRot is monitoring this session. If you find yourself repeating
approaches, re-reading files you already read, or making errors you
already fixed, call openrot_check to assess session health. If it
indicates degradation, call openrot_fix to generate a fresh start
prompt that preserves all decisions and progress.
${MARKER_END}`;

interface InstructionTarget {
  label: string;
  filePath: string;
}

/**
 * Get all instruction file targets for detected editors.
 */
export function getInstructionTargets(): InstructionTarget[] {
  const homeDir = os.homedir();
  const platform = os.platform();
  const targets: InstructionTarget[] = [];

  // Claude Code: ~/.claude/CLAUDE.md
  const claudeDir = path.join(homeDir, '.claude');
  const claudeJson = path.join(homeDir, '.claude.json');
  if (fs.existsSync(claudeDir) || fs.existsSync(claudeJson)) {
    targets.push({
      label: 'Claude Code',
      filePath: path.join(homeDir, '.claude', 'CLAUDE.md'),
    });
  }

  // Cursor: ~/.cursor/CURSOR.md
  const cursorDir = path.join(homeDir, '.cursor');
  if (fs.existsSync(cursorDir)) {
    targets.push({
      label: 'Cursor',
      filePath: path.join(homeDir, '.cursor', 'CURSOR.md'),
    });
  }

  // VS Code: copilot-instructions.md
  let vscodeBase: string;
  if (platform === 'win32') {
    vscodeBase = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Code', 'User');
  } else if (platform === 'darwin') {
    vscodeBase = path.join(homeDir, 'Library', 'Application Support', 'Code', 'User');
  } else {
    vscodeBase = path.join(homeDir, '.config', 'Code', 'User');
  }
  if (fs.existsSync(path.dirname(vscodeBase)) || fs.existsSync(vscodeBase)) {
    targets.push({
      label: 'VS Code',
      filePath: path.join(vscodeBase, 'copilot-instructions.md'),
    });
  }

  // Google Antigravity: copilot-instructions.md
  let agBase: string;
  if (platform === 'win32') {
    agBase = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Antigravity', 'User');
  } else if (platform === 'darwin') {
    agBase = path.join(homeDir, 'Library', 'Application Support', 'Antigravity', 'User');
  } else {
    agBase = path.join(homeDir, '.config', 'Antigravity', 'User');
  }
  if (fs.existsSync(path.dirname(agBase)) || fs.existsSync(agBase)) {
    targets.push({
      label: 'Google Antigravity',
      filePath: path.join(agBase, 'copilot-instructions.md'),
    });
  }

  return targets;
}

/**
 * Inject OpenRot instructions into a single instruction file.
 * Returns: 'created' | 'appended' | 'skipped' | 'error'
 */
export function injectInstructions(target: InstructionTarget): 'created' | 'appended' | 'skipped' | 'error' {
  try {
    const { filePath } = target;

    // Ensure parent directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Already has openrot block
      if (content.includes(MARKER_START)) {
        return 'skipped';
      }

      // Append to existing file
      const separator = content.endsWith('\n') ? '\n' : '\n\n';
      fs.writeFileSync(filePath, content + separator + INSTRUCTIONS_BLOCK + '\n', 'utf-8');
      return 'appended';
    }

    // Create new file
    fs.writeFileSync(filePath, INSTRUCTIONS_BLOCK + '\n', 'utf-8');
    return 'created';
  } catch {
    return 'error';
  }
}

/**
 * Remove OpenRot instructions from a single instruction file.
 * Returns: 'removed' | 'not-found' | 'error'
 */
export function removeInstructions(target: InstructionTarget): 'removed' | 'not-found' | 'error' {
  try {
    const { filePath } = target;

    if (!fs.existsSync(filePath)) {
      return 'not-found';
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    if (!content.includes(MARKER_START)) {
      return 'not-found';
    }

    // Remove the block and any surrounding blank lines
    const regex = new RegExp(`\\n?${escapeRegExp(MARKER_START)}[\\s\\S]*?${escapeRegExp(MARKER_END)}\\n?`, 'g');
    const cleaned = content.replace(regex, '\n').replace(/\n{3,}/g, '\n\n').trim();

    if (cleaned.length === 0) {
      // File is now empty — delete it
      fs.unlinkSync(filePath);
    } else {
      fs.writeFileSync(filePath, cleaned + '\n', 'utf-8');
    }

    return 'removed';
  } catch {
    return 'error';
  }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Inject instructions into all detected editors. Used by server startup and CLI.
 */
export function ensureGlobalInstructions(silent: boolean = false): void {
  const targets = getInstructionTargets();

  for (const target of targets) {
    const result = injectInstructions(target);

    if (!silent) {
      switch (result) {
        case 'created':
          console.log(chalk.green(`  ✅ ${target.label} instructions → ${chalk.dim(target.filePath)}`));
          break;
        case 'appended':
          console.log(chalk.green(`  ✅ ${target.label} instructions → ${chalk.dim(target.filePath)}`));
          break;
        case 'skipped':
          console.log(chalk.blue(`  ℹ️  ${target.label} instructions already present`));
          break;
        case 'error':
          console.log(chalk.yellow(`  ⚠️  Could not write ${target.label} instructions`));
          break;
      }
    }
  }
}

/**
 * openrot inject — manually inject/remove instructions for all detected editors.
 */
export async function runInject(options: { remove?: boolean }): Promise<void> {
  if (options.remove) {
    console.log(chalk.bold('\n🗑️  OpenRot — Removing Instructions\n'));

    const targets = getInstructionTargets();
    if (targets.length === 0) {
      console.log(chalk.dim('  No editor instruction files found.'));
      console.log('');
      return;
    }

    for (const target of targets) {
      const result = removeInstructions(target);
      switch (result) {
        case 'removed':
          console.log(chalk.green(`  ✅ Removed from ${target.label} → ${chalk.dim(target.filePath)}`));
          break;
        case 'not-found':
          console.log(chalk.dim(`  ─  No OpenRot block in ${target.label}`));
          break;
        case 'error':
          console.log(chalk.yellow(`  ⚠️  Could not update ${target.label}`));
          break;
      }
    }
  } else {
    console.log(chalk.bold('\n💉 OpenRot — Injecting Instructions\n'));
    ensureGlobalInstructions(false);
  }

  console.log('');
}
