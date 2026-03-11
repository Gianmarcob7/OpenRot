import type { ExtractionResult, ModelClient } from '../types.js';
import { extractWithRegex } from './regex.js';
import { extractWithEmbedding } from './embedding.js';
import { extractWithLLM } from './llm.js';

export type ExtractionMode = 'regex' | 'embedding' | 'llm' | 'auto';

interface ExtractionOptions {
  mode: ExtractionMode;
  modelClient: ModelClient | null;
}

/**
 * Orchestrate decision extraction across all tiers.
 * Tiers run in order, results are deduplicated.
 */
export async function extractDecisions(
  text: string,
  options: ExtractionOptions,
): Promise<ExtractionResult[]> {
  const results: ExtractionResult[] = [];
  const seen = new Set<string>();

  function addResults(newResults: ExtractionResult[]): void {
    for (const result of newResults) {
      const key = result.commitment.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        results.push(result);
      }
    }
  }

  // Tier 0: Regex (always runs)
  try {
    const regexResults = extractWithRegex(text);
    addResults(regexResults);
  } catch {
    // Fail silently
  }

  if (options.mode === 'regex') {
    return results;
  }

  // Tier 1: Embedding (extraction phase — mainly used for scoring)
  try {
    const embeddingResults = await extractWithEmbedding(text);
    addResults(embeddingResults);
  } catch {
    // Fail silently
  }

  // Tier 2: LLM extraction (if client available and mode allows)
  if (options.mode === 'auto' || options.mode === 'llm') {
    if (options.modelClient) {
      try {
        const llmResults = await extractWithLLM(text, options.modelClient);
        addResults(llmResults);
      } catch {
        // Fail silently
      }
    }
  }

  return results;
}

export { extractWithRegex } from './regex.js';
export { generateEmbedding, cosineSimilarity, isEmbeddingAvailable } from './embedding.js';
export { extractWithLLM } from './llm.js';
