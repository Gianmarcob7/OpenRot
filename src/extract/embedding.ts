import type { ExtractionResult } from '../types.js';

// Lazy-loaded pipeline and model
let pipeline: any = null;
let tokenizer: any = null;
let loadingPromise: Promise<void> | null = null;
let loadFailed = false;

/**
 * Initialize the embedding model lazily.
 * Uses @xenova/transformers with all-MiniLM-L6-v2 for local embeddings.
 */
async function ensureModel(): Promise<boolean> {
  if (pipeline) return true;
  if (loadFailed) return false;

  if (loadingPromise) {
    await loadingPromise;
    return pipeline !== null;
  }

  loadingPromise = (async () => {
    try {
      const { pipeline: createPipeline } = await import('@xenova/transformers');
      pipeline = await createPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        quantized: true,
      });
    } catch (error) {
      loadFailed = true;
      pipeline = null;
    }
  })();

  await loadingPromise;
  return pipeline !== null;
}

/**
 * Generate an embedding vector for the given text.
 * Returns null if the embedding model isn't available.
 */
export async function generateEmbedding(text: string): Promise<Float32Array | null> {
  try {
    const ready = await ensureModel();
    if (!ready) return null;

    const result = await pipeline(text, { pooling: 'mean', normalize: true });
    return new Float32Array(result.data);
  } catch {
    return null;
  }
}

/**
 * Compute cosine similarity between two embedding vectors.
 */
export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

/**
 * Check if the embedding model is available.
 */
export async function isEmbeddingAvailable(): Promise<boolean> {
  return ensureModel();
}

/**
 * Extract decisions using embedding similarity comparison (Tier 1).
 * Compares embedded text segments against known decision patterns.
 * This tier enhances regex extraction — it doesn't replace it.
 */
export async function extractWithEmbedding(text: string): Promise<ExtractionResult[]> {
  // Tier 1 is primarily used for contradiction scoring, not extraction.
  // For extraction, the embedding tier works by embedding the text and
  // storing it for later comparison. Actual decision extraction is done
  // by the regex and LLM tiers.
  // This function exists for the orchestrator interface but returns []
  // since embedding-based extraction is done in the scoring phase.
  return [];
}

/**
 * Reset the embedding model (for testing).
 */
export function resetEmbeddingModel(): void {
  pipeline = null;
  tokenizer = null;
  loadingPromise = null;
  loadFailed = false;
}
