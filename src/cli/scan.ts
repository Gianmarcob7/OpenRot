import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { parseTranscript } from '../transcript/index.js';
import { findTranscripts } from '../transcript/tail.js';
import { analyzeTranscript, SIGNAL_WEIGHTS } from '../detect/index.js';
import type { ViolationSignals } from '../detect/violations.js';
import type { DetectionResult, DetectionSignal, RotLevel } from '../types.js';

/**
 * openrot scan [path] — offline transcript analysis with beautiful terminal output.
 * This is the "first run" experience and the README GIF demo.
 */
export async function runScan(options: { path?: string; verbose?: boolean }): Promise<void> {
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
    if (result) {
      renderSingleSession(result.result, result.sessionId, result.file);
      if (options.verbose) renderVerbose(result.result);
    }
  } else {
    renderMultiSession(transcripts);
    if (options.verbose) {
      console.log(chalk.dim('  (--verbose only works with single file scans)'));
      console.log('');
    }
  }
}

function resolveScanPath(input?: string): string | null {
  if (input) {
    const resolved = path.resolve(input);
    if (fs.existsSync(resolved)) return resolved;

    if (input.startsWith('~')) {
      const expanded = path.join(os.homedir(), input.slice(1));
      if (fs.existsSync(expanded)) return expanded;
    }
    return null;
  }

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

  const levelColor = getLevelColor(score.level);
  const qualityBar = renderQualityBar(score.combined);
  const levelLabel = score.level.toUpperCase();

  console.log(chalk.dim('┌─────────────────────────────────────────────────┐'));
  console.log(chalk.dim('│') + chalk.bold('  OpenRot — Session Analysis') + ' '.repeat(21) + chalk.dim('│'));
  console.log(chalk.dim('│') + `  Session: ${chalk.bold(sessionId)} (${sessionDuration}, ${totalTurns} turns)` + padRight(45 - sessionId.length - sessionDuration.length - String(totalTurns).length) + chalk.dim('│'));
  console.log(chalk.dim('│') + `  Quality: ${qualityBar} ${levelColor(levelLabel)}` + ' '.repeat(Math.max(1, 7 - levelLabel.length)) + chalk.dim('│'));
  console.log(chalk.dim('└─────────────────────────────────────────────────┘'));

  if (totalTurns > 0) {
    console.log('');
    console.log(chalk.bold('Timeline:'));
    renderTimeline(totalTurns, score.rotPoint);
  }

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

/**
 * Render verbose output: decisions extracted, updates, active decisions,
 * per-signal scores and reasoning.
 */
function renderVerbose(result: DetectionResult): void {
  const { score, signals } = result;

  console.log(chalk.bold.cyan('─── Verbose Output ────────────────────────────────'));
  console.log('');

  // Per-signal score breakdown
  console.log(chalk.bold('Signal Scores:'));
  console.log(`  Violations:      ${formatSignalScore(score.violationScore)} (weight: ${SIGNAL_WEIGHTS.violation * 100}%)`);
  console.log(`  Circular:        ${formatSignalScore(score.circularScore)} (weight: ${SIGNAL_WEIGHTS.circular * 100}%)`);
  console.log(`  Repair loops:    ${formatSignalScore(score.repairLoopScore)} (weight: ${SIGNAL_WEIGHTS.repairLoop * 100}%)`);
  console.log(`  Quality:         ${formatSignalScore(score.qualityScore)} (weight: ${SIGNAL_WEIGHTS.quality * 100}%)`);
  console.log(`  Saturation:      ${formatSignalScore(score.saturationScore)} (weight: ${SIGNAL_WEIGHTS.saturation * 100}%)`);
  console.log(`  ${chalk.bold('Combined:')}        ${formatSignalScore(score.combined)}`);
  console.log('');

  // Decision tracking log from violations detector
  const violationSignals = signals as ViolationSignals;
  const verboseLog = violationSignals.__verboseLog;
  const decisions = violationSignals.__decisions;

  if (verboseLog && verboseLog.length > 0) {
    console.log(chalk.bold('Decision Tracking:'));
    for (const entry of verboseLog) {
      const turnStr = chalk.dim(`Turn ${String(entry.turn).padStart(3)}`);
      switch (entry.event) {
        case 'decision-added':
          console.log(`  ${chalk.green('+')} ${turnStr}  ${entry.detail}`);
          break;
        case 'decision-updated':
          console.log(`  ${chalk.yellow('~')} ${turnStr}  ${entry.detail}`);
          break;
        case 'violation':
          console.log(`  ${chalk.red('!')} ${turnStr}  ${entry.detail}`);
          break;
      }
    }
    console.log('');
  }

  if (decisions && decisions.length > 0) {
    const active = decisions.filter((d) => !d.supersededAt);
    const superseded = decisions.filter((d) => d.supersededAt);

    console.log(chalk.bold('Active Decisions:'));
    if (active.length === 0) {
      console.log(chalk.dim('  (none)'));
    } else {
      for (const d of active) {
        console.log(`  ${chalk.green('●')} ${chalk.dim(`Turn ${d.turn}`)}  ${d.commitment} ${chalk.dim(`(from ${d.source})`)}`);
      }
    }

    if (superseded.length > 0) {
      console.log('');
      console.log(chalk.bold('Superseded Decisions:'));
      for (const d of superseded) {
        console.log(`  ${chalk.dim('○')} ${chalk.dim(`Turn ${d.turn}`)}  ${chalk.strikethrough(d.commitment)} ${chalk.dim(`(replaced at turn ${d.supersededAt})`)}`);
      }
    }
    console.log('');
  }

  // All signals with full detail
  if (signals.length > 0) {
    console.log(chalk.bold('All Signals (unfiltered):'));
    for (const signal of signals) {
      const icon = signal.score >= 70 ? '🔴' :
                   signal.score >= 40 ? '⚠️ ' : chalk.dim('·');
      console.log(`  ${icon} ${chalk.dim(`Turn ${String(signal.turn).padStart(3)}`)}  [${signal.type}] score=${signal.score}  ${signal.description}`);
      if (signal.details) {
        console.log(`           ${chalk.dim(signal.details)}`);
      }
    }
    console.log('');
  }

  console.log(chalk.bold.cyan('───────────────────────────────────────────────────'));
  console.log('');
}

function formatSignalScore(score: number): string {
  const padded = String(score).padStart(3);
  if (score <= 20) return chalk.green(padded);
  if (score <= 45) return chalk.yellow(padded);
  return chalk.red(padded);
}

function renderMultiSession(transcripts: string[]): void {
  const sorted = transcripts
    .map((f) => ({ file: f, mtime: fs.statSync(f).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, 20);

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
