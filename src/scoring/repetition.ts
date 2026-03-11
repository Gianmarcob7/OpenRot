import { cosineSimilarity, generateEmbedding } from '../extract/embedding.js';

/**
 * Signal B: Self-repetition / looping detection.
 * Embeds the last N assistant responses and computes pairwise cosine similarity.
 * Score = average similarity * 100.
 * If avg similarity > 0.85, the AI is stuck/looping.
 * Weight: 30%
 */
export async function scoreRepetition(
  recentResponses: string[],
): Promise<number> {
  try {
    if (recentResponses.length < 2) return 0;

    // Take the last 5 responses
    const texts = recentResponses.slice(-5);

    // Generate embeddings for each response
    const embeddings: Float32Array[] = [];
    for (const text of texts) {
      // Truncate to first 500 chars to speed up embedding
      const truncated = text.substring(0, 500);
      const embedding = await generateEmbedding(truncated);
      if (embedding) {
        embeddings.push(embedding);
      }
    }

    if (embeddings.length < 2) return 0;

    // Compute pairwise cosine similarity between consecutive responses
    let totalSimilarity = 0;
    let pairCount = 0;

    for (let i = 1; i < embeddings.length; i++) {
      const sim = cosineSimilarity(embeddings[i - 1], embeddings[i]);
      totalSimilarity += sim;
      pairCount++;
    }

    if (pairCount === 0) return 0;

    const avgSimilarity = totalSimilarity / pairCount;
    return Math.min(100, avgSimilarity * 100);
  } catch {
    return 0;
  }
}

/**
 * Fast repetition check using string-level heuristics (no embeddings).
 * Used as a fallback when embeddings aren't available.
 */
export function scoreRepetitionFast(recentResponses: string[]): number {
  if (recentResponses.length < 2) return 0;

  const texts = recentResponses.slice(-5);
  let totalSimilarity = 0;
  let pairCount = 0;

  for (let i = 1; i < texts.length; i++) {
    const sim = jaccardSimilarity(texts[i - 1], texts[i]);
    totalSimilarity += sim;
    pairCount++;
  }

  if (pairCount === 0) return 0;
  return Math.min(100, (totalSimilarity / pairCount) * 100);
}

/**
 * Simple Jaccard similarity on word sets.
 */
function jaccardSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 3));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) intersection++;
  }

  const union = wordsA.size + wordsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
