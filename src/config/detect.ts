import type { DetectedEnvironment } from '../types.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { isOllamaRunning, getOllamaModels } from '../models/ollama.js';

/**
 * Auto-detect installed editors and available model providers.
 * Never throws — returns safe defaults on any failure.
 */
export async function detectEnvironment(): Promise<DetectedEnvironment> {
  const result: DetectedEnvironment = {
    editors: {
      claudeCode: false,
      cursor: false,
      vscode: false,
      antigravity: false,
    },
    models: {
      ollama: false,
      openai: false,
      anthropic: false,
      gemini: false,
    },
    ollamaModels: [],
  };

  // Detect editors
  try {
    const homeDir = os.homedir();

    // Claude Code: check for ~/.claude/ directory or ~/.claude.json
    const claudeConfigDir = path.join(homeDir, '.claude');
    const claudeJsonFile = path.join(homeDir, '.claude.json');
    result.editors.claudeCode = fs.existsSync(claudeConfigDir) || fs.existsSync(claudeJsonFile);

    // Cursor: check for ~/.cursor/ directory  
    const cursorConfigDir = path.join(homeDir, '.cursor');
    result.editors.cursor = fs.existsSync(cursorConfigDir);

    // VS Code: check for extensions directory with copilot
    const vscodeExtDir = path.join(homeDir, '.vscode', 'extensions');
    if (fs.existsSync(vscodeExtDir)) {
      try {
        const extensions = fs.readdirSync(vscodeExtDir);
        result.editors.vscode = extensions.some(
          (ext) => ext.toLowerCase().includes('copilot') || ext.toLowerCase().includes('mcp'),
        );
      } catch {
        result.editors.vscode = fs.existsSync(vscodeExtDir);
      }
    }

    // Antigravity: check for settings.json in platform-specific config dir
    try {
      let antigravitySettingsPath: string;
      const platform = os.platform();
      if (platform === 'win32') {
        antigravitySettingsPath = path.join(
          process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'),
          'Antigravity', 'User', 'settings.json',
        );
      } else if (platform === 'darwin') {
        antigravitySettingsPath = path.join(
          homeDir, 'Library', 'Application Support', 'Antigravity', 'User', 'settings.json',
        );
      } else {
        antigravitySettingsPath = path.join(
          homeDir, '.config', 'Antigravity', 'User', 'settings.json',
        );
      }
      result.editors.antigravity = fs.existsSync(antigravitySettingsPath);
    } catch {
      // Fail silently
    }
  } catch {
    // Fail silently
  }

  // Detect model providers
  try {
    result.models.openai = !!process.env.OPENAI_API_KEY;
    result.models.anthropic = !!process.env.ANTHROPIC_API_KEY;
    result.models.gemini = !!process.env.GEMINI_API_KEY;
  } catch {
    // Fail silently
  }

  // Detect Ollama
  try {
    result.models.ollama = await isOllamaRunning();
    if (result.models.ollama) {
      result.ollamaModels = await getOllamaModels();
    }
  } catch {
    // Fail silently
  }

  return result;
}
