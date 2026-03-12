import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { parseTranscript } from '../transcript/index.js';
import { findTranscripts } from '../transcript/tail.js';
import { analyzeTranscript } from '../detect/index.js';
import type { DetectionResult, DetectionSignal, RotLevel } from '../types.js';

/**
 * openrot scan [path] — offline transcript analysis with beautiful terminal output.
 * This is the "first run" experience and the README GIF demo.
 */
export async function runScan(options: { path?: string }): Promise<void> {
  const targetPath = resolveScanPath(options.path);

  if (!targetPath) {
    console.log(chalk.yellow('No transcript files found.'));
    console.log('');
    console.log('Usage:');
    console.log(`  ${chalk.bold('openrot scan')} ~/.claude/projects/`);
    console.log(`  ${chalk.bold('openrot scan')} <path-to-session.jsonl>`);
    console.log('');
    console.log('Claude Code stores transcripts in:');
    console.log(chalk.dim(`  ${path.join(os.homedir(), '.claude', 'projects')}`));
    return;
  }

  const transcripts = findTranscripts(targetPath);

  if (transcripts.length === 0) {
    console.log(chalk.yellow('No .jsonl transcript files found at:'));
    console.log(chalk.dim(`  ${targetPath}`));
    return;
  }

  console.log('');

  if (transcripts.length === 1) {
    const result = analyzeFile(transcripts[0]);
    if (result) renderSingleSession(result.result, result.sessionId, result.file);
  } else {
    renderMultiSession(transcripts);
  }
}

function resolveScanPath(input?: string): string | null {
  if (input) {
    const resolved = path.resolve(input);
    if (fs.existsSync(resolved)) return resolved;

    // Try expanding ~ on Windows
    if (input.startsWith('~')) {
      const expanded = path.join(os.homedir(), input.slice(1));
      if (fs.existsSync(expanded)) return expanded;
    }
    return null;
  }

  // Default: look for Claude Code transcripts
  const claudeDir = path.join(os.homedir(), '.claude', 'projects');
  if (fs.existsSync(claudeDir)) return claudeDir;

  return null;
}

interface AnalysisResult {
  result: DetectionResult;
  sessionId: string;
  file: string;
}

function analyzeFile(file: string): AnalysisResult | null {
  try {
    const messages = parseTranscript(file);
    if (messages.length === 0) return null;

    const result = analyzeTranscript(messages);
    const sessionId = path.basename(file, '.jsonl').substring(0, 8);
    return { result, sessionId, file };
  } catch {
    return null;
  }
}

function renderSingleSession(result: DetectionResult, sessionId: string, file: string): void {
  const { score, signals, totalTurns, sessionDuration } = result;

  // Header box
  const levelColor = getLevelColor(score.level);
  const qualityBar = renderQualityBar(score.combined);
  const levelLabel = score.level.toUpperCase();

  console.log(chalk.dim('┌─────────────────────────────────────────────────┐'));
  console.log(chalk.dim('│') + chalk.bold('  OpenRot — Session Analysis') + ' '.repeat(21) + chalk.dim('│'));
  console.log(chalk.dim('│') + `  Session: ${chalk.bold(sessionId)} (${sessionDuration}, ${totalTurns} turns)` + padRight(45 - sessionId.length - sessionDuration.length - String(totalTurns).length) + chalk.dim('│'));
  console.log(chalk.dim('│') + `  Quality: ${qualityBar} ${levelColor(levelLabel)}` + ' '.repeat(Math.max(1, 7 - levelLabel.length)) + chalk.dim('│'));
  console.log(chalk.dim('└─────────────────────────────────────────────────┘'));

  // Timeline
  if (totalTurns > 0) {
    console.log('');
    console.log(chalk.bold('Timeline:'));
    renderTimeline(totalTurns, score.rotPoint);
  }

  // Signals
  if (signals.length > 0) {
    console.log('');
    console.log(chalk.bold('Signals:'));

    const displayed = signals.filter((s) => s.score >= 40).slice(0, 10);
    for (const signal of displayed) {
      const icon = signal.score >= 70 ? '🔴' : '⚠️ ';
      const turnStr = chalk.dim(`Turn ${String(signal.turn).padStart(3)}`);
      console.log(`  ${icon} ${turnStr}  ${chalk.bold(signal.description)}`);
      if (signal.details) {
        console.log(`           ${chalk.dim(signal.details)}`);
      }
    }
  }

  // Footer
  console.log('');
  console.log(chalk.bold('━'.repeat(49)));

  if (score.rotPoint && score.level !== 'healthy') {
    const wastedTurns = totalTurns - score.rotPoint;
    const wastedMinutes = estimateMinutes(wastedTurns);
    console.log(levelColor(`${wastedTurns} turns of degraded output (~${wastedMinutes} min wasted)`));
    console.log(`Run: ${chalk.bold(`openrot fix --session ${sessionId}`)}`);
  } else if (score.level === 'healthy') {
    console.log(chalk.green('Session looks healthy. No degradation detected.'));
  } else {
    console.log(levelColor(`Session is ${score.level}. Score: ${score.combined}%`));
  }

  console.log(chalk.bold('━'.repeat(49)));
  console.log('');
}

function renderMultiSession(transcripts: string[]): void {
  // Sort by modification time (newest first)
  const sorted = transcripts
    .map((f) => ({ file: f, mtime: fs.statSync(f).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, 20); // Limit to 20 most recent

  console.log(chalk.bold(`OpenRot — Scanning ${sorted.length} session${sorted.length > 1 ? 's' : ''}`));
  console.log(chalk.bold('━'.repeat(60)));
  console.log('');

  let degradedCount = 0;
  let rottedCount = 0;

  for (const { file } of sorted) {
    const analysis = analyzeFile(file);
    if (!analysis) continue;

    const { result, sessionId } = analysis;
    const { score, totalTurns, sessionDuration } = result;

    if (score.level === 'degrading') degradedCount++;
    if (score.level === 'rotted') rottedCount++;

    const levelColor = getLevelColor(score.level);
    const icon = score.level === 'rotted' ? '🔴' : score.level === 'degrading' ? '⚠️ ' : '✅';
    const barMini = renderQualityBarMini(score.combined);

    console.log(`  ${icon} ${chalk.bold(sessionId)}  ${barMini}  ${levelColor(score.level.toUpperCase().padEnd(9))}  ${chalk.dim(`${totalTurns} turns, ${sessionDuration}`)}`);

    if (score.rotPoint && score.level !== 'healthy') {
      const topSignal = result.signals.filter((s) => s.score >= 60)[0];
      if (topSignal) {
        console.log(`     ${chalk.dim(`└─ ${topSignal.description}: ${topSignal.details || ''}`.substring(0, 70))}`);
      }
    }
  }

  console.log('');
  console.log(chalk.bold('━'.repeat(60)));

  if (rottedCount > 0 || degradedCount > 0) {
    const parts: string[] = [];
    if (rottedCount > 0) parts.push(chalk.red(`${rottedCount} rotted`));
    if (degradedCount > 0) parts.push(chalk.yellow(`${degradedCount} degrading`));
    console.log(`${parts.join(', ')} out of ${sorted.length} sessions`);
    console.log(`Run ${chalk.bold('openrot scan <session.jsonl>')} for detailed analysis`);
  } else {
    console.log(chalk.green('All recent sessions look healthy.'));
  }

  console.log(chalk.bold('━'.repeat(60)));
  console.log('');
}

function renderTimeline(totalTurns: number, rotPoint: number | null): void {
  const maxWidth = Math.min(totalTurns, 50);
  const scale = totalTurns / maxWidth;

  let timeline = '';
  for (let i = 0; i < maxWidth; i++) {
    const turn = Math.round(i * scale);
    if (rotPoint && turn >= rotPoint) {
      if (turn === Math.round((rotPoint - 1) / scale) * Math.round(scale)) {
        timeline += chalk.dim('│') + chalk.red('⚠');
      } else {
        timeline += chalk.red('●');
      }
    } else {
      timeline += chalk.green('●');
    }
    timeline += ' ';
  }

  console.log(`  ${timeline}`);

  // Labels
  const startLabel = 'Turn 1';
  const endLabel = `${totalTurns}`;
  if (rotPoint) {
    const rotPos = Math.round(((rotPoint - 1) / totalTurns) * maxWidth * 2);
    const padding = ' '.repeat(Math.max(0, rotPos - 2));
    console.log(chalk.dim(`  ${startLabel}${padding}${rotPoint}`) + ' '.repeat(Math.max(1, maxWidth * 2 - rotPos - endLabel.length - startLabel.length - 2)) + chalk.dim(endLabel));
    console.log(`  ${' '.repeat(Math.max(0, rotPos + startLabel.length - 1))}${chalk.red('└─ rot detected')}`);
  } else {
    console.log(chalk.dim(`  ${startLabel}${' '.repeat(Math.max(1, maxWidth * 2 - startLabel.length - endLabel.length))}${endLabel}`));
  }
}

function renderQualityBar(score: number): string {
  const barWidth = 20;
  const healthyWidth = Math.round(((100 - score) / 100) * barWidth);
  const degradedWidth = barWidth - healthyWidth;

  const healthyPart = chalk.green('█'.repeat(healthyWidth));
  const degradedPart = chalk.dim('░'.repeat(degradedWidth));

  return `${healthyPart}${degradedPart} ${score}%`;
}

function renderQualityBarMini(score: number): string {
  const barWidth = 8;
  const filled = Math.round(((100 - score) / 100) * barWidth);
  const empty = barWidth - filled;

  if (score <= 20) return chalk.green('█'.repeat(filled) + '░'.repeat(empty));
  if (score <= 45) return chalk.yellow('█'.repeat(filled) + '░'.repeat(empty));
  return chalk.red('█'.repeat(filled) + '░'.repeat(empty));
}

function getLevelColor(level: RotLevel): (text: string) => string {
  if (level === 'healthy') return chalk.green;
  if (level === 'degrading') return chalk.yellow;
  return chalk.red;
}

function padRight(n: number): string {
  return ' '.repeat(Math.max(0, n));
}

function estimateMinutes(turns: number): number {
  return Math.round(turns * 2.5);
}
