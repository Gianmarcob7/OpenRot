import chalk from 'chalk';
import { loadConfig, saveConfig, getConfigPath } from '../config/index.js';

/**
 * openrot config — interactive config editor.
 */
export async function runConfig(): Promise<void> {
  const config = await loadConfig();
  const configPath = getConfigPath();

  console.log(chalk.bold('\n⚙️  OpenRot — Configuration\n'));
  console.log(chalk.dim(`Config file: ${configPath}`));
  console.log('');

  try {
    const { default: inquirer } = await import('inquirer');

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'extractionMode',
        message: 'Extraction mode:',
        choices: [
          { name: 'Auto (detect best available)', value: 'auto' },
          { name: 'Regex only (zero cost)', value: 'regex' },
          { name: 'OpenAI', value: 'openai' },
          { name: 'Anthropic', value: 'anthropic' },
          { name: 'Gemini', value: 'gemini' },
          { name: 'Ollama (local)', value: 'ollama' },
          { name: 'Custom (OpenAI-compatible)', value: 'custom' },
        ],
        default: config.extraction.mode,
      },
      {
        type: 'list',
        name: 'sensitivity',
        message: 'Sensitivity level:',
        choices: [
          { name: 'Low (fewer warnings, higher confidence required)', value: 'low' },
          { name: 'Medium (balanced)', value: 'medium' },
          { name: 'High (more warnings, catches more)', value: 'high' },
        ],
        default: config.sensitivity,
      },
      {
        type: 'number',
        name: 'threshold',
        message: 'Confidence threshold (0.0-1.0):',
        default: config.threshold,
        validate: (val: number) =>
          val >= 0 && val <= 1 ? true : 'Must be between 0.0 and 1.0',
      },
    ]);

    config.extraction.mode = answers.extractionMode;
    config.contradiction.mode = answers.extractionMode;
    config.sensitivity = answers.sensitivity;
    config.threshold = answers.threshold;

    // If custom mode, ask for additional config
    if (answers.extractionMode === 'custom') {
      const customAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'baseUrl',
          message: 'API base URL:',
          default: config.extraction.baseUrl || '',
        },
        {
          type: 'input',
          name: 'model',
          message: 'Model name:',
          default: config.extraction.model || '',
        },
        {
          type: 'input',
          name: 'apiKey',
          message: 'API key (leave blank to use env var):',
          default: '',
        },
      ]);

      config.extraction.baseUrl = customAnswers.baseUrl || null;
      config.extraction.model = customAnswers.model || null;
      config.extraction.apiKey = customAnswers.apiKey || null;
      config.contradiction.baseUrl = customAnswers.baseUrl || null;
      config.contradiction.model = customAnswers.model || null;
      config.contradiction.apiKey = customAnswers.apiKey || null;
    }

    saveConfig(config);
    console.log('');
    console.log(chalk.green('✅ Configuration saved!'));
    console.log(chalk.dim(`   ${configPath}`));
  } catch {
    // Non-interactive mode — just print current config
    console.log(chalk.bold('Current configuration:'));
    console.log(JSON.stringify(config, null, 2));
  }
}
