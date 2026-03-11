import type { TranscriptMessage } from '../types.js';
import fs from 'fs';

/**
 * Parse a Claude Code JSONL transcript file into structured messages.
 * Each line is a JSON object: { type, message, timestamp }
 */
export function parseTranscript(transcriptPath: string): TranscriptMessage[] {
  try {
    if (!fs.existsSync(transcriptPath)) return [];
    const content = fs.readFileSync(transcriptPath, 'utf-8');
    return parseTranscriptContent(content);
  } catch {
    return [];
  }
}

/**
 * Parse JSONL content directly (useful for testing).
 */
export function parseTranscriptContent(content: string): TranscriptMessage[] {
  const messages: TranscriptMessage[] = [];
  const lines = content.split('\n').filter((l) => l.trim().length > 0);

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.type && parsed.message) {
        messages.push(parsed as TranscriptMessage);
      }
    } catch {
      // Skip malformed lines
    }
  }

  return messages;
}

/**
 * Extract the text content from a TranscriptMessage.
 * Handles both string content and structured content arrays.
 */
export function getMessageText(msg: TranscriptMessage): string {
  if (typeof msg.message.content === 'string') {
    return msg.message.content;
  }
  if (Array.isArray(msg.message.content)) {
    return msg.message.content
      .filter((block) => block.type === 'text' && block.text)
      .map((block) => block.text!)
      .join('\n');
  }
  return '';
}

/**
 * Get the last N assistant responses from a transcript.
 */
export function getLastAssistantResponses(
  messages: TranscriptMessage[],
  count: number = 5,
): string[] {
  return messages
    .filter((m) => m.type === 'assistant')
    .slice(-count)
    .map(getMessageText)
    .filter((t) => t.length > 0);
}

/**
 * Count turns (user-assistant pairs) in a transcript.
 */
export function countTurns(messages: TranscriptMessage[]): number {
  return messages.filter((m) => m.type === 'assistant').length;
}

/**
 * Get all user messages from a transcript.
 */
export function getUserMessages(messages: TranscriptMessage[]): string[] {
  return messages
    .filter((m) => m.type === 'user')
    .map(getMessageText)
    .filter((t) => t.length > 0);
}

/**
 * Get all assistant messages from a transcript.
 */
export function getAssistantMessages(messages: TranscriptMessage[]): string[] {
  return messages
    .filter((m) => m.type === 'assistant')
    .map(getMessageText)
    .filter((t) => t.length > 0);
}
