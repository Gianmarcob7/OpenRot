import type { OpenRotConfig } from '../types.js';
import { cosmiconfig } from 'cosmiconfig';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { DEFAULT_CONFIG, mergeConfig } from './defaults.js';

const MODULE_NAME = 'openrot';

/**
 * Load OpenRot config from any of:
 * 1. ~/.openrot/config.json (preferred)
 * 2. .openrotrc, .openrotrc.json, .openrotrc.yaml
 * 3. openrot.config.js
 * 4. package.json "openrot" key
 *
 * Falls back to DEFAULT_CONFIG if no config found.
 */
export async function loadConfig(): Promise<OpenRotConfig> {
  try {
    const explorer = cosmiconfig(MODULE_NAME, {
      searchPlaces: [
        `.${MODULE_NAME}rc`,
        `.${MODULE_NAME}rc.json`,
        `.${MODULE_NAME}rc.yaml`,
        `.${MODULE_NAME}rc.yml`,
        `${MODULE_NAME}.config.js`,
        `${MODULE_NAME}.config.cjs`,
        'package.json',
      ],
    });

    // First, try the dedicated config file
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf-8');
        const userConfig = JSON.parse(content);
        return mergeConfig(userConfig);
      } catch {
        // Invalid JSON — fall through to cosmiconfig
      }
    }

    // Then, try cosmiconfig search
    const result = await explorer.search();
    if (result && result.config) {
      return mergeConfig(result.config);
    }

    return DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

/**
 * Save config to ~/.openrot/config.json.
 */
export function saveConfig(config: OpenRotConfig): void {
  try {
    const configDir = path.join(os.homedir(), '.openrot');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const configPath = path.join(configDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  } catch {
    // Fail silently
  }
}

/**
 * Get the path to the config file.
 */
export function getConfigPath(): string {
  return path.join(os.homedir(), '.openrot', 'config.json');
}

export { DEFAULT_CONFIG, mergeConfig } from './defaults.js';
export { detectEnvironment } from './detect.js';
