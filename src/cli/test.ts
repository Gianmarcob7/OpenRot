import chalk from 'chalk';
import { getDb } from '../db/index.js';
import { extractWithRegex } from '../extract/regex.js';
import { isEmbeddingAvailable } from '../extract/embedding.js';
import { getModelClient, getModelName } from '../models/index.js';
import { spawn } from 'child_process';
import path from 'path';

/**
 * openrot test — self-test to verify everything works.
 */
export async function runTest(): Promise<void> {
  console.log(chalk.bold('\n🧪 OpenRot — Self Test\n'));

  let allPassed = true;

  // 1. Check database
  try {
    const db = await getDb();
    // Quick test query
    db.exec('SELECT 1');
    console.log(chalk.green('✅ Database: OK'));
  } catch (error) {
    console.log(chalk.red(`❌ Database: ${error}`));
    allPassed = false;
  }

  // 2. Check regex extraction
  try {
    const results = extractWithRegex("let's use Tailwind for styling");
    if (results.length >= 1) {
      console.log(chalk.green('✅ Regex extraction: OK'));
      console.log(chalk.dim(`   Extracted: "${results[0].commitment}"`));
    } else {
      console.log(chalk.red('❌ Regex extraction: No decisions extracted'));
      allPassed = false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ Regex extraction: ${error}`));
    allPassed = false;
  }

  // 3. Check embedding model
  try {
    console.log(chalk.dim('   Loading embedding model (this may take a moment)...'));
    const available = await isEmbeddingAvailable();
    if (available) {
      console.log(chalk.green('✅ Embeddings: OK (all-MiniLM-L6-v2)'));
    } else {
      console.log(chalk.yellow('⚠️  Embeddings: not loaded (optional — will download on first use)'));
    }
  } catch (error) {
    console.log(chalk.yellow(`⚠️  Embeddings: not loaded (${error})`));
  }

  // 4. Check model provider
  try {
    const selection = await getModelClient();
    if (selection) {
      const name = getModelName(selection);
      console.log(chalk.green(`✅ Provider: ${name}`));
    } else {
      console.log(chalk.yellow('⚠️  No API provider configured (regex mode only)'));
      console.log(chalk.dim('   Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY'));
      console.log(chalk.dim('   Or install Ollama at https://ollama.com'));
    }
  } catch (error) {
    console.log(chalk.yellow(`⚠️  Provider detection failed: ${error}`));
  }

  // 5. Check MCP server starts
  try {
    const serverProcess = spawn(process.execPath, [process.argv[1], 'serve'], {
      stdio: 'pipe',
      timeout: 5000,
    });

    const started = await new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        // If process is still running after 2s, it started successfully
        if (!serverProcess.killed) {
          serverProcess.kill();
          resolve(true);
        }
      }, 2000);

      serverProcess.on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });

      serverProcess.on('exit', (code) => {
        if (code !== null && code !== 0) {
          clearTimeout(timeout);
          resolve(false);
        }
      });
    });

    if (started) {
      console.log(chalk.green('✅ MCP server: OK'));
    } else {
      console.log(chalk.red('❌ MCP server: Failed to start'));
      allPassed = false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ MCP server: ${error}`));
    allPassed = false;
  }

  // Final summary
  console.log('');
  console.log(chalk.bold('━'.repeat(40)));
  if (allPassed) {
    console.log(chalk.green.bold('OpenRot self-test complete. ✅'));
  } else {
    console.log(chalk.yellow.bold('OpenRot self-test complete with issues.'));
  }
  console.log('');
  console.log(`Run ${chalk.bold('openrot init')} to configure editors.`);
  console.log(`Run ${chalk.bold('openrot serve')} to start the MCP server.`);
  console.log('');
}
