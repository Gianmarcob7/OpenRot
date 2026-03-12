import type {
  TranscriptMessage,
  DetectionResult,
  DetectionSignal,
  ParsedTurn,
  RotScore,
  RotLevel,
  ToolCall,
} from '../types.js';
import { getMessageText } from '../transcript/index.js';
import { countHedgingPhrases } from '../transcript/tokens.js';
import { detectViolations, scoreViolations } from './violations.js';
import { detectCircular, scoreCircular } from './circular.js';
import { detectRepairLoops, scoreRepairLoops } from './repair-loops.js';
import { detectQualityDecline, scoreQuality } from './quality.js';
import { detectSaturation, scoreSaturation } from './saturation.js';

const SIGNAL_WEIGHTS = {
  violation: 0.25,
  circular: 0.25,
  repairLoop: 0.25,
  quality: 0.15,
  saturation: 0.10,
};

/**
 * Run all 5 detection signals on a transcript and produce a combined score.
 * This is the core analysis engine used by both `openrot scan` and `openrot analyze`.
 */
export function analyzeTranscript(messages: TranscriptMessage[]): DetectionResult {
  const turns = parseAllTurns(messages);
  const totalTurns = turns.filter((t) => t.type === 'assistant').length;

  // Run all signal detectors
  const signals: DetectionSignal[] = [
    ...detectViolations(turns),
    ...detectCircular(turns),
    ...detectRepairLoops(turns),
    ...detectQualityDecline(turns),
    ...detectSaturation(turns),
  ];

  // Sort signals by turn
  signals.sort((a, b) => a.turn - b.turn);

  // Compute individual scores
  const violationScore = scoreViolations(signals);
  const circularScore = scoreCircular(signals);
  const repairLoopScore = scoreRepairLoops(signals);
  const qualityScore = scoreQuality(signals);
  const saturationScore = scoreSaturation(signals);

  // Combined weighted score
  const combined = Math.round(
    violationScore * SIGNAL_WEIGHTS.violation +
    circularScore * SIGNAL_WEIGHTS.circular +
    repairLoopScore * SIGNAL_WEIGHTS.repairLoop +
    qualityScore * SIGNAL_WEIGHTS.quality +
    saturationScore * SIGNAL_WEIGHTS.saturation,
  );

  const level = getRotLevel(combined);
  const rotPoint = findRotPoint(signals);

  // Compute session duration
  const sessionDuration = computeSessionDuration(messages);

  return {
    score: {
      violationScore,
      circularScore,
      repairLoopScore,
      qualityScore,
      saturationScore,
      combined,
      level,
      turn: totalTurns,
      rotPoint,
    },
    signals,
    turns,
    sessionDuration,
    totalTurns,
  };
}

/**
 * Lightweight analysis for the Stop hook — only parse last N turns.
 */
export function analyzeLastTurns(messages: TranscriptMessage[]): DetectionResult {
  // Take only the last 20 messages for speed
  const recent = messages.slice(-20);
  return analyzeTranscript(recent);
}

/**
 * Parse raw transcript messages into structured ParsedTurns with
 * tool call extraction, code block counting, etc.
 */
export function parseAllTurns(messages: TranscriptMessage[]): ParsedTurn[] {
  const turns: ParsedTurn[] = [];
  let turnIndex = 0;

  for (const msg of messages) {
    const text = getMessageText(msg);
    if (!text) continue;

    turnIndex++;
    const toolCalls = extractToolCalls(msg);
    const codeBlocks = countCodeBlocks(text);
    const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
    const hedgingCount = msg.type === 'assistant' ? countHedgingPhrases(text) : 0;

    turns.push({
      index: turnIndex,
      type: msg.type,
      text,
      timestamp: msg.timestamp,
      toolCalls,
      codeBlocks,
      wordCount,
      hedgingCount,
    });
  }

  return turns;
}

/**
 * Extract tool calls from a transcript message.
 * Claude Code transcripts embed tool calls in the content array.
 */
function extractToolCalls(msg: TranscriptMessage): ToolCall[] {
  const tools: ToolCall[] = [];

  if (Array.isArray(msg.message.content)) {
    for (const block of msg.message.content) {
      if (block.type === 'tool_use' || block.type === 'tool_call') {
        const b = block as Record<string, unknown>;
        const input = b.input as Record<string, unknown> | undefined;
        tools.push({
          toolName: (b.name as string) || 'unknown',
          filePath: (input?.file_path as string) || (input?.path as string) || (input?.filePath as string) || undefined,
          input: input ? JSON.stringify(input).substring(0, 200) : undefined,
        });
      }

      if (block.type === 'tool_result') {
        const b = block as Record<string, unknown>;
        const content = b.content as string | undefined;
        if (content && /(?:error|Error|FAIL|exit code [1-9])/.test(content)) {
          const lastTool = tools[tools.length - 1];
          if (lastTool) {
            lastTool.exitCode = 1;
            lastTool.error = content.substring(0, 200);
          }
        }
      }
    }
  }

  // Also extract tool calls mentioned in text (for transcripts with inline tool usage)
  if (typeof msg.message.content === 'string') {
    const text = msg.message.content;
    const toolPattern = /(?:Running|Executing|Called)\s+`?(\w+)`?\s+(?:on|with|for)\s+[`"']?([^\s`"'\n]+)/gi;
    let match;
    while ((match = toolPattern.exec(text)) !== null) {
      tools.push({
        toolName: match[1],
        filePath: match[2],
      });
    }
  }

  return tools;
}

function countCodeBlocks(text: string): number {
  const matches = text.match(/```/g);
  return matches ? Math.floor(matches.length / 2) : 0;
}

export function getRotLevel(score: number): RotLevel {
  if (score <= 20) return 'healthy';
  if (score <= 45) return 'degrading';
  return 'rotted';
}

/**
 * Find the earliest turn where a significant degradation signal fires.
 */
function findRotPoint(signals: DetectionSignal[]): number | null {
  const significant = signals.filter((s) => s.score >= 60);
  if (significant.length === 0) return null;
  return Math.min(...significant.map((s) => s.turn));
}

function computeSessionDuration(messages: TranscriptMessage[]): string {
  if (messages.length < 2) return '0m';

  const first = messages[0].timestamp;
  const last = messages[messages.length - 1].timestamp;

  if (!first || !last) {
    const turns = messages.filter((m) => m.type === 'assistant').length;
    const estimatedMinutes = turns * 3;
    if (estimatedMinutes >= 60) {
      return `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`;
    }
    return `${estimatedMinutes}m`;
  }

  try {
    const startMs = new Date(first).getTime();
    const endMs = new Date(last).getTime();
    const durationMs = endMs - startMs;
    const minutes = Math.round(durationMs / 60000);

    if (minutes >= 60) {
      return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  } catch {
    return '?';
  }
}

export { SIGNAL_WEIGHTS };
