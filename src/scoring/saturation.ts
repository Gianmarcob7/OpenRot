import type { TranscriptMessage } from '../types.js';
import { getAssistantMessages } from '../transcript/index.js';
import { estimateSaturation, countHedgingPhrases, detectShrinkingResponses } from '../transcript/tokens.js';

/**
 * Signal C: Context saturation estimate.
 * Based on token usage, response shrinkage, and hedging phrases.
 * Weight: 30%
 */
export function scoreSaturation(messages: TranscriptMessage[]): number {
  try {
    if (messages.length === 0) return 0;

    // Base: estimated token saturation (0–100)
    const baseSaturation = estimateSaturation(messages);

    // Penalty: hedging phrases in recent responses
    const assistantTexts = getAssistantMessages(messages);
    const recentTexts = assistantTexts.slice(-5);

    let hedgingPenalty = 0;
    if (recentTexts.length > 0) {
      const totalHedging = recentTexts.reduce(
        (sum, text) => sum + countHedgingPhrases(text),
        0,
      );
      const avgHedging = totalHedging / recentTexts.length;
      // More than 3 hedging phrases per response adds a penalty
      hedgingPenalty = Math.min(15, Math.max(0, (avgHedging - 1) * 5));
    }

    // Penalty: shrinking response lengths
    const shrinkingPenalty = detectShrinkingResponses(recentTexts) * 15;

    return Math.min(100, baseSaturation + hedgingPenalty + shrinkingPenalty);
  } catch {
    return 0;
  }
}
