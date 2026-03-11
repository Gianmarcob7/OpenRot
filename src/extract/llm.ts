import type { ExtractionResult, ModelClient, LLMExtractionItem, DecisionType } from '../types.js';

const EXTRACTION_SYSTEM_PROMPT = `You are a decision extractor. Given a message from an AI coding assistant,
extract any architectural decisions, technical constraints, or explicit
commitments made. Return ONLY a JSON array. Each item:
{
  "commitment": "concise statement of the decision",
  "type": "use|avoid|always|never|architectural",
  "confidence": 0.0-1.0
}
If no decisions found, return [].
Do not explain. Return only the JSON array.`;

/**
 * Extract decisions using an LLM (Tier 2).
 * Requires a configured model client.
 */
export async function extractWithLLM(
  text: string,
  client: ModelClient,
): Promise<ExtractionResult[]> {
  try {
    const response = await client.complete(EXTRACTION_SYSTEM_PROMPT, text);

    // Parse JSON from the response — handle markdown code blocks
    let jsonStr = response.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed: LLMExtractionItem[] = JSON.parse(jsonStr);

    if (!Array.isArray(parsed)) return [];

    const validTypes: DecisionType[] = ['use', 'avoid', 'always', 'never', 'architectural'];

    return parsed
      .filter(
        (item) =>
          item.commitment &&
          typeof item.commitment === 'string' &&
          validTypes.includes(item.type) &&
          typeof item.confidence === 'number' &&
          item.confidence >= 0 &&
          item.confidence <= 1,
      )
      .map((item) => ({
        commitment: item.commitment,
        type: item.type,
        confidence: item.confidence,
        rawText: text.substring(0, 200), // Store a snippet of the original
        source: 'llm' as const,
      }));
  } catch {
    // Fail silently — fall back to lower tiers
    return [];
  }
}
