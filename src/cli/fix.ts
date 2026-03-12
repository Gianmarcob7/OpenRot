import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { parseTranscript, getMessageText, getAssistantMessages, getUserMessages } from '../transcript/index.js';
import { findTranscripts } from '../transcript/tail.js';
import { analyzeTranscript } from '../detect/index.js';
import { extractWithRegex } from '../extract/regex.js';
import type { TranscriptMessage, DetectionResult } from '../types.js';

/**
 * openrot fix — generate a handoff prompt with rot-point awareness.
 * Identifies the degradation point, extracts pre-rot context,
 * and generates a prompt for a fresh session.
 */
export async function runFix(options: { session?: string }): Promise<void> {
  // Find the transcript
  const transcript = findTargetTranscript(options.session);
  if (!transcript) {
    console.log(chalk.yellow('No transcript found.'));
    console.log('');
    console.log('Usage:');
    console.log(`  ${chalk.bold('openrot fix')}                         Fix the most recent session`);
    console.log(`  ${chalk.bold('openrot fix --session abc123')}        Fix a specific session`);
    console.log('');
    return;
  }

  const messages = parseTranscript(transcript);
  if (messages.length === 0) {
    console.log(chalk.yellow('Transcript is empty.'));
    return;
  }

  // Analyze to find rot point
  const result = analyzeTranscript(messages);
  const { score, signals } = result;

  // Generate the handoff prompt
  const prompt = generateFixPrompt(messages, result);

  // Display
  console.log('');
  console.log(chalk.bold('━'.repeat(60)));
  console.log(prompt);
  console.log(chalk.bold('━'.repeat(60)));
  console.log('');

  // Copy to clipboard
  try {
    const { default: clipboardy } = await import('clipboardy');
    await clipboardy.write(prompt);
    console.log(chalk.green('✅ Handoff prompt copied to clipboard'));
  } catch {
    console.log(chalk.dim('(Could not copy to clipboard)'));
  }

  // Save to disk
  const handoffDir = path.join(os.homedir(), '.openrot', 'handoffs');
  if (!fs.existsSync(handoffDir)) fs.mkdirSync(handoffDir, { recursive: true });
  const date = new Date().toISOString().split('T')[0];
  const projectName = path.basename(process.cwd());
  const fileName = `${date}-${projectName}.md`;
  const filePath = path.join(handoffDir, fileName);
  fs.writeFileSync(filePath, prompt, 'utf-8');
  console.log(chalk.dim(`   Saved to ${filePath}`));

  // Show summary
  if (score.rotPoint) {
    console.log('');
    console.log(`   Session degraded at turn ${chalk.bold(String(score.rotPoint))}`);
    console.log(`   ${chalk.green('✓')} Decisions and progress from before turn ${score.rotPoint} preserved`);
    console.log(`   ${chalk.yellow('⚠')} Work after turn ${score.rotPoint} may need re-verification`);
  }

  console.log('');
  console.log(chalk.dim('   Paste into a new session to continue with full context.'));
  console.log('');
}

function findTargetTranscript(sessionHint?: string): string | null {
  const claudeDir = path.join(os.homedir(), '.claude', 'projects');

  if (!fs.existsSync(claudeDir)) return null;

  const allTranscripts = findTranscripts(claudeDir);
  if (allTranscripts.length === 0) return null;

  if (sessionHint) {
    const match = allTranscripts.find((f) => path.basename(f).includes(sessionHint));
    if (match) return match;
  }

  // Return most recently modified transcript
  return allTranscripts
    .map((f) => ({ file: f, mtime: fs.statSync(f).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0]?.file || null;
}

function generateFixPrompt(messages: TranscriptMessage[], result: DetectionResult): string {
  const { score, signals } = result;
  const rotPoint = score.rotPoint;

  // Split messages at rot point
  const preRotMessages = rotPoint
    ? messages.filter((_, i) => i < rotPoint * 2) // Rough: each turn ≈ 2 messages (user+assistant)
    : messages;

  // Extract decisions from pre-rot messages
  const decisions = extractDecisionsFromMessages(preRotMessages);
  const completed = extractCompletedWork(preRotMessages);
  const inProgress = extractInProgressWork(messages, rotPoint);
  const avoid = extractAvoidPatterns(signals);

  const projectName = path.basename(process.cwd());
  const lines: string[] = [];

  lines.push(`Continuing a previous session on ${projectName}.`);
  if (rotPoint) {
    lines.push(`The prior session degraded after turn ${rotPoint}.`);
    lines.push('Below is the verified context from before degradation.');
  }
  lines.push('');

  if (decisions.length > 0) {
    lines.push('DECISIONS MADE:');
    for (const d of decisions) lines.push(`- ${d}`);
    lines.push('');
  }

  if (completed.length > 0) {
    lines.push(`COMPLETED${rotPoint ? ' (verified before degradation)' : ''}:`);
    for (const c of completed) lines.push(`- ${c}`);
    lines.push('');
  }

  if (inProgress.length > 0) {
    lines.push(`IN PROGRESS${rotPoint ? ' (may need re-verification)' : ''}:`);
    for (const ip of inProgress) lines.push(`- ${ip}`);
    lines.push('');
  }

  if (avoid.length > 0) {
    lines.push('AVOID (these caused issues in the prior session):');
    for (const a of avoid) lines.push(`- ${a}`);
    lines.push('');
  }

  const lastTask = inProgress[0] || completed[completed.length - 1] || 'the current task';
  lines.push(`Continue from ${lastTask}.`);

  return lines.join('\n');
}

function extractDecisionsFromMessages(messages: TranscriptMessage[]): string[] {
  const decisions: string[] = [];
  const seen = new Set<string>();

  for (const msg of messages) {
    if (msg.type !== 'assistant') continue;
    const text = getMessageText(msg);
    const extracted = extractWithRegex(text);
    for (const e of extracted) {
      const normalized = e.commitment.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        decisions.push(e.commitment);
      }
    }
  }

  return decisions.slice(0, 15);
}

function extractCompletedWork(messages: TranscriptMessage[]): string[] {
  const completed: string[] = [];
  const seen = new Set<string>();

  const donePatterns = [
    /(?:I've|I have|we've|we have)\s+(?:created|built|implemented|added|set up|configured|written|updated|fixed|completed)\s+(.+?)(?:\.|$)/gi,
    /✅\s*(.+)/g,
  ];

  const assistantTexts = getAssistantMessages(messages);
  for (const text of assistantTexts) {
    for (const pattern of donePatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim().substring(0, 100);
        if (item.length > 5 && !seen.has(item.toLowerCase())) {
          seen.add(item.toLowerCase());
          completed.push(item);
        }
      }
    }
  }

  return completed.slice(0, 20);
}

function extractInProgressWork(messages: TranscriptMessage[], rotPoint: number | null): string[] {
  // Look at the messages around the rot point (or the end)
  const relevantMessages = rotPoint
    ? messages.slice(Math.max(0, rotPoint * 2 - 4), rotPoint * 2 + 4)
    : messages.slice(-6);

  const inProgress: string[] = [];
  const progressPatterns = [
    /(?:I'm|I am|let me|I'll)\s+(?:now\s+)?(?:working on|implementing|building|creating|adding|fixing|updating)\s+(.+?)(?:\.|$)/gi,
    /(?:next|now)\s+(?:I'll|let's|we'll)\s+(.+?)(?:\.|$)/gi,
  ];

  for (const msg of relevantMessages) {
    const text = getMessageText(msg);
    for (const pattern of progressPatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim().substring(0, 100);
        if (item.length > 5) inProgress.push(item);
      }
    }
  }

  return inProgress.slice(0, 5);
}

function extractAvoidPatterns(signals: import('../types.js').DetectionSignal[]): string[] {
  const avoid: string[] = [];

  for (const signal of signals) {
    if (signal.type === 'violation' && signal.details) {
      avoid.push(signal.details);
    }
    if (signal.type === 'circular' && signal.details) {
      avoid.push(`Do not ${signal.details.toLowerCase()}`);
    }
    if (signal.type === 'repair-loop' && signal.details) {
      avoid.push(signal.details);
    }
  }

  return avoid.slice(0, 10);
}
