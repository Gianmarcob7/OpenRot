import chalk from 'chalk';
import { getDb, saveToFile } from '../db/index.js';
import { DecisionStore } from '../db/decisions.js';
import { SessionStore } from '../db/sessions.js';
import { parseTranscript, countTurns, getAssistantMessages } from '../transcript/index.js';
import { extractHandoffData } from '../handoff/extractor.js';
import { formatHandoff, formatForEditor } from '../handoff/formatter.js';
import { saveHandoff, saveHandoffForEditor } from '../handoff/index.js';
import { EDITOR_FILE_NAMES } from '../handoff/templates.js';
import path from 'path';
import os from 'os';
import fs from 'fs';

/**
 * openrot handoff — generate fresh start prompt from current/last session.
 */
export async function runHandoff(options: { for?: string }): Promise<void> {
  try {
    const db = await getDb();
    const sessionStore = new SessionStore(db);
    const decisionStore = new DecisionStore(db);

    // Find the latest session
    const sessions = sessionStore.getAll();
    if (sessions.length === 0) {
      console.log(chalk.yellow('No sessions found. Start coding with an AI tool first.'));
      return;
    }

    const latestSession = sessions[0];
    const decisions = decisionStore.getBySessionId(latestSession.id);
    const commitments = decisions.map((d) => d.commitment);

    // Try to find and parse the transcript
    const cwd = process.cwd();
    const projectName = path.basename(cwd);

    // Look for Claude Code session JSONL
    let messages: any[] = [];
    const claudeDir = path.join(os.homedir(), '.claude', 'projects');
    if (fs.existsSync(claudeDir)) {
      try {
        const projectDirs = fs.readdirSync(claudeDir);
        for (const dir of projectDirs) {
          const sessionDir = path.join(claudeDir, dir);
          const files = fs.readdirSync(sessionDir).filter((f) => f.endsWith('.jsonl'));
          if (files.length > 0) {
            const latestFile = files.sort().pop()!;
            messages = parseTranscript(path.join(sessionDir, latestFile));
            if (messages.length > 0) break;
          }
        }
      } catch {
        // Can't read Claude sessions
      }
    }

    // Extract handoff data
    const handoffData = extractHandoffData(messages, commitments, projectName);
    const prompt = formatHandoff(handoffData);

    // Save to database
    saveHandoff(db, latestSession.id, cwd, prompt, saveToFile);

    // Print to stdout
    console.log('');
    console.log(chalk.bold('━'.repeat(60)));
    console.log(prompt);
    console.log(chalk.bold('━'.repeat(60)));
    console.log('');

    // Copy to clipboard
    try {
      const { default: clipboardy } = await import('clipboardy');
      await clipboardy.write(prompt);
      console.log(chalk.green('✅ Copied to clipboard'));
    } catch {
      console.log(chalk.dim('(Could not copy to clipboard)'));
    }

    // Save for specific editor if requested
    if (options.for) {
      const editor = options.for.toLowerCase();
      const fileName = EDITOR_FILE_NAMES[editor];
      if (fileName) {
        const formatted = formatForEditor(prompt, editor);
        const filePath = saveHandoffForEditor(prompt, editor, cwd);
        if (filePath) {
          console.log(chalk.green(`✅ Saved to ${chalk.dim(filePath)}`));
        } else {
          console.log(chalk.yellow(`⚠️  Could not save for ${editor}`));
        }
      } else {
        console.log(chalk.yellow(`Unknown editor: ${options.for}. Use: claude, cursor, antigravity, copilot`));
      }
    }

    // Show save location
    const date = new Date().toISOString().split('T')[0];
    const handoffPath = path.join(os.homedir(), '.openrot', 'handoffs', `${date}-${projectName}.md`);
    console.log(chalk.dim(`Saved to ${handoffPath}`));
    console.log('');
  } catch (error) {
    console.error(chalk.red('Handoff failed:'), error);
  }
}
