import chalk from 'chalk';
import { loadConfig, saveConfig } from '../config/index.js';
import { isOllamaRunning, getOllamaModels } from '../models/ollama.js';
import type { ModelMode } from '../types.js';

const RECOMMENDED_MODELS: Record<string, string[]> = {
  openai: ['gpt-4o-mini', 'gpt-4o'],
  anthropic: ['claude-haiku-4-5-20251001', 'claude-sonnet-4-5'],
  gemini: ['gemini-2.0-flash', 'gemini-1.5-pro'],
};

const PROVIDER_LABELS: Record<string, string> = {
  ollama: 'Ollama (local, free)',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Gemini',
  regex: 'Regex only (no LLM)',
};

interface ModelCommandOptions {
  provider?: string;
  model?: string;
  key?: string;
}

/**
 * openrot model — persistent model switcher.
 */
export async function runModel(options: ModelCommandOptions): Promise<void> {
  // Non-interactive mode
  if (options.provider) {
    await runNonInteractive(options);
    return;
  }

  // Interactive mode
  await runInteractive();
}

async function runNonInteractive(options: ModelCommandOptions): Promise<void> {
  const provider = options.provider as ModelMode;
  const validProviders: ModelMode[] = ['ollama', 'openai', 'anthropic', 'gemini', 'regex'];

  if (!validProviders.includes(provider)) {
    console.log(chalk.red(`❌ Invalid provider: ${options.provider}`));
    console.log(chalk.dim(`   Valid options: ${validProviders.join(', ')}`));
    process.exit(1);
  }

  const config = await loadConfig();

  config.extraction.mode = provider;
  config.contradiction.mode = provider;
  config.extraction.model = options.model || null;
  config.contradiction.model = options.model || null;

  if (options.key) {
    config.extraction.apiKey = options.key;
    config.contradiction.apiKey = options.key;
  }

  saveConfig(config);

  const displayModel = options.model || '(default)';
  console.log(chalk.green(`✅ Saved. OpenRot is now using ${provider} / ${displayModel}`));
}

async function runInteractive(): Promise<void> {
  const { default: inquirer } = await import('inquirer');
  const config = await loadConfig();

  // 1. Show current configuration
  const currentProvider = config.extraction.mode;
  const currentModel = config.extraction.model || '(auto)';

  console.log('');
  console.log(chalk.dim('  ┌─────────────────────────────────┐'));
  console.log(chalk.dim('  │') + ` Current: ${chalk.bold(currentProvider)} / ${chalk.bold(currentModel)} ` + chalk.dim('│'));
  console.log(chalk.dim('  └─────────────────────────────────┘'));
  console.log('');

  // 2. Provider selection
  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Select provider:',
      choices: [
        { name: PROVIDER_LABELS.ollama, value: 'ollama' },
        { name: PROVIDER_LABELS.openai, value: 'openai' },
        { name: PROVIDER_LABELS.anthropic, value: 'anthropic' },
        { name: PROVIDER_LABELS.gemini, value: 'gemini' },
        { name: PROVIDER_LABELS.regex, value: 'regex' },
      ],
    },
  ]);

  // 3. Provider-specific flow
  let selectedModel: string | null = null;
  let apiKey: string | null = config.extraction.apiKey;

  if (provider === 'regex') {
    // No further questions
  } else if (provider === 'ollama') {
    const result = await handleOllama();
    if (!result) return; // Ollama not running or no models
    selectedModel = result;
  } else {
    // OpenAI / Anthropic / Gemini
    const result = await handleCloudProvider(provider, inquirer);
    if (!result) return;
    selectedModel = result.model;
    apiKey = result.apiKey;
  }

  // 4. Save
  config.extraction.mode = provider as ModelMode;
  config.contradiction.mode = provider as ModelMode;
  config.extraction.model = selectedModel;
  config.contradiction.model = selectedModel;

  if (apiKey !== config.extraction.apiKey) {
    config.extraction.apiKey = apiKey;
    config.contradiction.apiKey = apiKey;
  }

  saveConfig(config);

  // 5. Confirm
  const displayModel = selectedModel || '(default)';
  console.log('');
  console.log(chalk.green(`✅ Saved. OpenRot is now using ${chalk.bold(provider)} / ${chalk.bold(displayModel)}`));
  console.log('');
}

async function handleOllama(): Promise<string | null> {
  const running = await isOllamaRunning();

  if (!running) {
    console.log(chalk.yellow('\n  ⚠️  Ollama not running. Start it first.'));
    console.log(chalk.dim('     https://ollama.com\n'));
    return null;
  }

  const models = await getOllamaModels();

  if (models.length === 0) {
    console.log(chalk.yellow('\n  ⚠️  No models installed. Run: ollama pull qwen2.5-coder:3b\n'));
    return null;
  }

  const { default: inquirer } = await import('inquirer');
  const { model } = await inquirer.prompt([
    {
      type: 'list',
      name: 'model',
      message: 'Select Ollama model:',
      choices: models.map((m) => ({ name: m, value: m })),
    },
  ]);

  return model;
}

async function handleCloudProvider(
  provider: string,
  inquirer: any,
): Promise<{ model: string; apiKey: string | null } | null> {
  const recommended = RECOMMENDED_MODELS[provider] || [];

  // Model selection
  const modelChoices = [
    ...recommended.map((m) => ({ name: m, value: m })),
    { name: 'Enter custom model name', value: '__custom__' },
  ];

  const { model: selectedModel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'model',
      message: 'Select model:',
      choices: modelChoices,
    },
  ]);

  let model = selectedModel;
  if (model === '__custom__') {
    const { customModel } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customModel',
        message: 'Model name:',
        validate: (val: string) => (val.trim().length > 0 ? true : 'Model name cannot be empty'),
      },
    ]);
    model = customModel.trim();
  }

  // API key
  const envVarMap: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    gemini: 'GEMINI_API_KEY',
  };
  const envVar = envVarMap[provider];
  const hasEnvKey = envVar ? !!process.env[envVar] : false;

  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: `API key${hasEnvKey ? ` (${envVar} detected, press Enter to keep)` : ''}:`,
      mask: '*',
      validate: (val: string) => {
        if (val.trim().length > 0) return true;
        if (hasEnvKey) return true;
        return 'API key cannot be empty (no environment variable set)';
      },
    },
  ]);

  return {
    model,
    apiKey: apiKey.trim().length > 0 ? apiKey.trim() : null,
  };
}
