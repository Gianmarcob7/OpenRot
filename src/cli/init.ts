import chalk from 'chalk';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { execSync } from 'child_process';
import { loadConfig, saveConfig, detectEnvironment } from '../config/index.js';
import { DEFAULT_CONFIG } from '../config/defaults.js';
import { ensureGlobalInstructions } from './inject.js';

/**
 * openrot init — setup and configure OpenRot.
 * Auto-detects editors and providers, writes config, offers clipboard copy of editor snippets.
 */
export async function runInit(): Promise<void> {
  console.log(chalk.bold('\n🔍 OpenRot — Setup\n'));

  // Step 1: Auto-detect editors
  console.log(chalk.dim('Detecting editors and providers...'));
  const env = await detectEnvironment();

  // Step 2: Build config
  const config = { ...DEFAULT_CONFIG };

  // Auto-configure model mode based on detection
  if (env.models.openai) {
    config.extraction.mode = 'auto';
    config.contradiction.mode = 'auto';
  } else if (env.models.anthropic) {
    config.extraction.mode = 'auto';
    config.contradiction.mode = 'auto';
  } else if (env.models.gemini) {
    config.extraction.mode = 'auto';
    config.contradiction.mode = 'auto';
  } else if (env.models.ollama) {
    config.extraction.mode = 'auto';
    config.contradiction.mode = 'auto';
  } else {
    config.extraction.mode = 'regex';
    config.contradiction.mode = 'regex';
  }

  // Step 3: Write ~/.openrot/config.json
  saveConfig(config);
  const configPath = path.join(os.homedir(), '.openrot', 'config.json');
  console.log(chalk.green('✅ Config written to'), chalk.dim(configPath));

  // Step 4: Print detection results
  console.log('');
  console.log(chalk.bold('Editors detected:'));
  if (env.editors.claudeCode) console.log(chalk.green('  ✅ Claude Code'));
  if (env.editors.cursor) console.log(chalk.green('  ✅ Cursor'));
  if (env.editors.vscode) console.log(chalk.green('  ✅ VS Code'));
  if (env.editors.antigravity) console.log(chalk.green('  ✅ Google Antigravity'));
  if (!env.editors.claudeCode && !env.editors.cursor && !env.editors.vscode && !env.editors.antigravity) {
    console.log(chalk.dim('  (none detected)'));
  }

  console.log('');
  console.log(chalk.bold('Model providers:'));
  if (env.models.openai) console.log(chalk.green('  ✅ OpenAI (OPENAI_API_KEY)'));
  if (env.models.anthropic) console.log(chalk.green('  ✅ Anthropic (ANTHROPIC_API_KEY)'));
  if (env.models.gemini) console.log(chalk.green('  ✅ Gemini (GEMINI_API_KEY)'));
  if (env.models.ollama) {
    console.log(chalk.green('  ✅ Ollama (local)'));
    if (env.ollamaModels.length > 0) {
      console.log(chalk.dim(`     Models: ${env.ollamaModels.slice(0, 5).join(', ')}`));
    }
  }
  if (!env.models.openai && !env.models.anthropic && !env.models.gemini && !env.models.ollama) {
    console.log(chalk.yellow('  ⚠️  No API keys or Ollama detected — using regex mode only'));
    console.log(chalk.dim('     (Still useful! Set an API key later for deeper analysis)'));
  }

  // Step 5: Auto-configure detected editors
  const detectedEditors = getDetectedEditors(env);

  if (detectedEditors.length > 0) {
    console.log('');
    const editorNames = detectedEditors.map((e) => e.label).join(', ');
    console.log(chalk.bold(`  Found: ${editorNames}`));
    console.log('  OpenRot will configure these automatically.');

    let proceed = true;
    try {
      const { default: inquirer } = await import('inquirer');
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Proceed?',
          default: true,
        },
      ]);
      proceed = answer.proceed;
    } catch {
      // Non-interactive — proceed by default
    }

    console.log('');
    if (proceed) {
      for (const editor of detectedEditors) {
        await writeEditorConfig(editor);
      }
    } else {
      // Fallback: show snippets with clipboard offers
      for (const editor of detectedEditors) {
        await showSnippetFallback(editor);
      }
    }
  }

  // Step 6: Auto-inject editor instructions
  console.log('');
  console.log(chalk.bold('Editor instructions:'));
  ensureGlobalInstructions(false);

  // Final summary
  console.log('');
  console.log(chalk.bold('━'.repeat(45)));
  console.log(chalk.green.bold('🎉 OpenRot is ready!'));
  console.log('');
  if (detectedEditors.length > 0) {
    console.log('  Restart your editor(s) for changes to take effect.');
  }
  console.log('  Run', chalk.bold('openrot test'), 'to verify everything works.');
  console.log('  Run', chalk.bold('openrot serve'), 'to start the MCP server.');
  console.log('');
}

async function offerClipboardCopy(text: string): Promise<void> {
  try {
    const { default: inquirer } = await import('inquirer');
    const { copy } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'copy',
        message: 'Copy to clipboard?',
        default: true,
      },
    ]);

    if (copy) {
      try {
        const { default: clipboardy } = await import('clipboardy');
        await clipboardy.write(text);
        console.log(chalk.green('  Copied to clipboard! ✅'));
      } catch {
        console.log(chalk.yellow('  Could not copy to clipboard. Please copy manually.'));
      }
    }
  } catch {
    // Not in interactive mode, skip
  }
}

// ── Editor auto-configuration helpers ──────────────────────

interface EditorInfo {
  label: string;
  configPath: string;
  /** Top-level key that holds server entries (e.g. "mcpServers" or "mcp.servers") */
  mcpKey: string;
  /** The openrot entry to merge under the mcpKey */
  entry: Record<string, unknown>;
  /** The full snippet to show if auto-write fails */
  snippet: string;
}

const OPENROT_ENTRY = {
  command: 'openrot',
  args: ['serve'],
};

function getDetectedEditors(env: { editors: Record<string, boolean> }): EditorInfo[] {
  const homeDir = os.homedir();
  const platform = os.platform();
  const editors: EditorInfo[] = [];

  const mcpServersSnippet = JSON.stringify(
    { mcpServers: { openrot: OPENROT_ENTRY } },
    null,
    2,
  );
  const settingsSnippet = JSON.stringify(
    { 'mcp.servers': { openrot: OPENROT_ENTRY } },
    null,
    2,
  );

  if (env.editors.claudeCode) {
    const claudeCommand = resolveOpenrotCommand();
    const claudeEntry = { command: claudeCommand, args: ['serve'] };
    const claudeSnippet = JSON.stringify(
      { mcpServers: { openrot: claudeEntry } },
      null,
      2,
    );
    editors.push({
      label: 'Claude Code',
      configPath: path.join(homeDir, '.claude.json'),
      mcpKey: 'mcpServers',
      entry: { openrot: claudeEntry },
      snippet: claudeSnippet,
    });
  }

  if (env.editors.cursor) {
    editors.push({
      label: 'Cursor',
      configPath: path.join(homeDir, '.cursor', 'mcp.json'),
      mcpKey: 'mcpServers',
      entry: { openrot: OPENROT_ENTRY },
      snippet: mcpServersSnippet,
    });
  }

  if (env.editors.vscode) {
    let vscodeBase: string;
    if (platform === 'win32') {
      vscodeBase = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Code', 'User');
    } else if (platform === 'darwin') {
      vscodeBase = path.join(homeDir, 'Library', 'Application Support', 'Code', 'User');
    } else {
      vscodeBase = path.join(homeDir, '.config', 'Code', 'User');
    }
    editors.push({
      label: 'VS Code',
      configPath: path.join(vscodeBase, 'settings.json'),
      mcpKey: 'mcp.servers',
      entry: { openrot: OPENROT_ENTRY },
      snippet: settingsSnippet,
    });
  }

  if (env.editors.antigravity) {
    let agBase: string;
    if (platform === 'win32') {
      agBase = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Antigravity', 'User');
    } else if (platform === 'darwin') {
      agBase = path.join(homeDir, 'Library', 'Application Support', 'Antigravity', 'User');
    } else {
      agBase = path.join(homeDir, '.config', 'Antigravity', 'User');
    }
    editors.push({
      label: 'Google Antigravity',
      configPath: path.join(agBase, 'settings.json'),
      mcpKey: 'mcp.servers',
      entry: { openrot: OPENROT_ENTRY },
      snippet: settingsSnippet,
    });
  }

  return editors;
}

async function writeEditorConfig(editor: EditorInfo): Promise<void> {
  try {
    const { configPath, mcpKey, entry, label } = editor;

    // Ensure parent directory exists
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Read existing file or start fresh
    let existing: Record<string, any> = {};
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8');
      try {
        existing = JSON.parse(raw);
      } catch {
        // Malformed JSON — do NOT touch it
        console.log(chalk.yellow(`  ⚠️  Could not update ${label} config — invalid JSON`));
        console.log(chalk.dim(`     ${configPath}`));
        console.log(`     Add this manually:`);
        console.log(chalk.cyan(`     ${editor.snippet.split('\n').join('\n     ')}`));
        return;
      }

      // Check if already configured
      const mcpSection = existing[mcpKey];
      if (mcpSection && typeof mcpSection === 'object' && 'openrot' in mcpSection) {
        console.log(chalk.blue(`  ℹ️  OpenRot already configured in ${label}`));
        return;
      }
    }

    // Merge the openrot entry
    if (!existing[mcpKey] || typeof existing[mcpKey] !== 'object') {
      existing[mcpKey] = {};
    }
    Object.assign(existing[mcpKey], entry);

    // Write back
    fs.writeFileSync(configPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
    console.log(chalk.green(`  ✅ ${label} configured → ${chalk.dim(configPath)}`));
  } catch (error) {
    // Any failure — fall back to showing snippet
    console.log(chalk.yellow(`  ⚠️  Could not write ${editor.label} config: ${error}`));
    await showSnippetFallback(editor);
  }
}

async function showSnippetFallback(editor: EditorInfo): Promise<void> {
  console.log('');
  console.log(chalk.bold('━'.repeat(45)));
  console.log(chalk.green.bold(`✅ ${editor.label} detected`));
  console.log('');
  console.log(`Add this to ${chalk.dim(editor.configPath)}:`);
  console.log('');
  console.log(chalk.cyan(editor.snippet));
  console.log('');
  await offerClipboardCopy(editor.snippet);
}

/**
 * On Windows, Claude Code can't always resolve npm global binaries from PATH.
 * Use `where.exe openrot` to find the full .cmd path.
 * Falls back to plain "openrot" on non-Windows or if resolution fails.
 */
function resolveOpenrotCommand(): string {
  if (os.platform() !== 'win32') return 'openrot';

  try {
    const output = execSync('where.exe openrot', { encoding: 'utf-8', timeout: 5000 });
    const cmdPath = output
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.endsWith('.cmd'));
    if (cmdPath) return cmdPath;
  } catch {
    // where.exe failed — fall back
  }

  return 'openrot';
}
