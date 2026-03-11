import fs from 'fs';
import path from 'path';

const HOOK_SCRIPT_UNIX = `#!/bin/sh
# OpenRot pre-commit hook — scans staged files against decisions
staged_files=$(git diff --cached --name-only --diff-filter=ACM)
if [ -z "$staged_files" ]; then
  exit 0
fi

result=$(echo "$staged_files" | xargs openrot scan --files 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo "$result"
  echo ""
  echo "Commit blocked by OpenRot. Fix violations or bypass with: git commit --no-verify"
  exit 1
fi

exit 0
`;

const HOOK_SCRIPT_WIN = `#!/bin/sh
# OpenRot pre-commit hook — scans staged files against decisions
staged_files=$(git diff --cached --name-only --diff-filter=ACM)
if [ -z "$staged_files" ]; then
  exit 0
fi

result=$(echo "$staged_files" | xargs openrot scan --files 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo "$result"
  echo ""
  echo "Commit blocked by OpenRot. Fix violations or bypass with: git commit --no-verify"
  exit 1
fi

exit 0
`;

const HOOK_MARKER = '# OpenRot pre-commit hook';

/**
 * Install the OpenRot pre-commit hook.
 */
export function installGuard(projectPath: string): { success: boolean; message: string } {
  try {
    const gitDir = path.join(projectPath, '.git');
    if (!fs.existsSync(gitDir)) {
      return { success: false, message: 'Not a git repository' };
    }

    const hooksDir = path.join(gitDir, 'hooks');
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }

    const hookPath = path.join(hooksDir, 'pre-commit');

    // Check if hook already exists
    if (fs.existsSync(hookPath)) {
      const content = fs.readFileSync(hookPath, 'utf-8');
      if (content.includes(HOOK_MARKER)) {
        return { success: true, message: 'OpenRot hook already installed' };
      }
      // Append to existing hook
      fs.appendFileSync(hookPath, '\n\n' + HOOK_SCRIPT_UNIX, 'utf-8');
    } else {
      fs.writeFileSync(hookPath, HOOK_SCRIPT_UNIX, { mode: 0o755 });
    }

    // Make executable on Unix
    try {
      fs.chmodSync(hookPath, 0o755);
    } catch {
      // Windows doesn't support chmod
    }

    return { success: true, message: `Pre-commit hook installed at ${hookPath}` };
  } catch (error) {
    return { success: false, message: `Failed to install hook: ${error}` };
  }
}

/**
 * Remove the OpenRot pre-commit hook.
 */
export function removeGuard(projectPath: string): { success: boolean; message: string } {
  try {
    const hookPath = path.join(projectPath, '.git', 'hooks', 'pre-commit');

    if (!fs.existsSync(hookPath)) {
      return { success: true, message: 'No pre-commit hook found' };
    }

    const content = fs.readFileSync(hookPath, 'utf-8');
    if (!content.includes(HOOK_MARKER)) {
      return { success: true, message: 'No OpenRot hook found in pre-commit' };
    }

    // Remove OpenRot section
    const cleaned = content
      .replace(new RegExp(`\\n?${HOOK_MARKER}[\\s\\S]*?exit 0\\n`, 'g'), '')
      .trim();

    if (cleaned.length === 0 || cleaned === '#!/bin/sh') {
      fs.unlinkSync(hookPath);
    } else {
      fs.writeFileSync(hookPath, cleaned + '\n', 'utf-8');
    }

    return { success: true, message: 'OpenRot pre-commit hook removed' };
  } catch (error) {
    return { success: false, message: `Failed to remove hook: ${error}` };
  }
}
