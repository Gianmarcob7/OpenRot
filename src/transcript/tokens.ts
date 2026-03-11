import type { TranscriptMessage } from '../types.js';
import { getMessageText } from './index.js';

/** Rough token estimate: ~4 chars per token (GPT/Claude average) */
const CHARS_PER_TOKEN = 4;

/** Claude Code context window size */
const CONTEXT_LIMIT = 200_000;

/**
 * Estimate token count for a string.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Estimate total tokens used in a transcript.
 */
export function estimateTotalTokens(messages: TranscriptMessage[]): number {
  let total = 0;
  for (const msg of messages) {
    total += estimateTokens(getMessageText(msg));
  }
  return total;
}

/**
 * Estimate context saturation as a percentage (0–100).
 */
export function estimateSaturation(messages: TranscriptMessage[]): number {
  const totalTokens = estimateTotalTokens(messages);
  return Math.min(100, (totalTokens / CONTEXT_LIMIT) * 100);
}

/**
 * Detect hedging phrases that indicate AI uncertainty/degradation.
 * Returns a count of hedging phrases found.
 */
export function countHedgingPhrases(text: string): number {
  const hedgingPatterns = [
    /\bi think\b/gi,
    /\bperhaps\b/gi,
    /\bit seems\b/gi,
    /\bmaybe\b/gi,
    /\bmight be\b/gi,
    /\bcould be\b/gi,
    /\bi believe\b/gi,
    /\bpossibly\b/gi,
    /\bI'm not (?:entirely )?sure\b/gi,
    /\bif I recall\b/gi,
    /\bI would guess\b/gi,
    /\bnot certain\b/gi,
  ];

  let count = 0;
  for (const pattern of hedgingPatterns) {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  }
  return count;
}

/**
 * Detect if response lengths are shrinking (a sign of context saturation).
 * Returns a ratio (0–1) where 1 = severely shrinking.
 */
export function detectShrinkingResponses(responses: string[]): number {
  if (responses.length < 3) return 0;

  const lengths = responses.map((r) => r.length);
  const firstHalf = lengths.slice(0, Math.floor(lengths.length / 2));
  const secondHalf = lengths.slice(Math.floor(lengths.length / 2));

  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  if (avgFirst === 0) return 0;

  const ratio = avgSecond / avgFirst;
  // If second half is less than 50% of first half, that's severe shrinking
  if (ratio < 0.5) return 1;
  if (ratio < 0.75) return 0.5;
  if (ratio < 0.9) return 0.2;
  return 0;
}

export { CONTEXT_LIMIT, CHARS_PER_TOKEN };
