import type { JudgeResult, ModelClient, Decision } from '../types.js';

const JUDGE_SYSTEM_PROMPT = `Given a prior decision and a new AI response, determine if the response
contradicts the decision. Reply with only:
{"contradicts": true/false, "confidence": 0.0-1.0, "reason": "one sentence"}`;

/**
 * Use an LLM to judge whether a response contradicts a prior decision.
 * Returns null if the judge is unavailable or fails.
 */
export async function judgeContradiction(
  decision: Decision,
  responseText: string,
  client: ModelClient,
): Promise<JudgeResult | null> {
  try {
    const userMessage = `Prior decision (turn ${decision.turn}): "${decision.commitment}"

New AI response excerpt: "${responseText.substring(0, 500)}"

Does the new response contradict the prior decision?`;

    const response = await client.complete(JUDGE_SYSTEM_PROMPT, userMessage);

    // Parse JSON from the response
    let jsonStr = response.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonStr);

    if (
      typeof parsed.contradicts !== 'boolean' ||
      typeof parsed.confidence !== 'number' ||
      typeof parsed.reason !== 'string'
    ) {
      return null;
    }

    return {
      contradicts: parsed.contradicts,
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
      reason: parsed.reason,
    };
  } catch {
    // Fail silently
    return null;
  }
}
