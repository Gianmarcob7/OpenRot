import type { Decision, ContradictionResult, ModelClient, SimilarityMatch } from '../types.js';
import { entityPreFilter, findSimilarDecisions, checkSimpleContradiction } from './similarity.js';
import { judgeContradiction } from './judge.js';

interface ScoreOptions {
  threshold: number;
  modelClient: ModelClient | null;
  sensitivity: 'low' | 'medium' | 'high';
}

const SENSITIVITY_THRESHOLDS = {
  low: 0.85,
  medium: 0.75,
  high: 0.6,
};

const SIMILARITY_THRESHOLDS = {
  low: 0.7,
  medium: 0.6,
  high: 0.5,
};

/**
 * Score a new AI response against stored decisions for contradictions.
 */
export async function scoreContradictions(
  responseText: string,
  decisions: Decision[],
  options: ScoreOptions,
): Promise<ContradictionResult[]> {
  if (decisions.length === 0) return [];

  const contradictions: ContradictionResult[] = [];
  const confidenceThreshold = options.threshold || SENSITIVITY_THRESHOLDS[options.sensitivity];
  const similarityThreshold = SIMILARITY_THRESHOLDS[options.sensitivity] || 0.6;

  // Step 1: Entity pre-filter
  let relevantDecisions: Decision[];
  try {
    relevantDecisions = entityPreFilter(responseText, decisions);
  } catch {
    relevantDecisions = decisions;
  }

  if (relevantDecisions.length === 0) return [];

  // Step 2: Check simple regex-based contradictions
  for (const decision of relevantDecisions) {
    try {
      const reason = checkSimpleContradiction(decision, responseText);
      if (reason) {
        contradictions.push({
          isContradiction: true,
          confidence: 0.85,
          reason,
          priorDecision: decision,
          relevantExcerpt: extractRelevantExcerpt(responseText, decision),
        });
      }
    } catch {
      // Fail silently
    }
  }

  // Step 3: Embedding-based similarity scoring
  try {
    const similarMatches = await findSimilarDecisions(
      responseText,
      relevantDecisions,
      similarityThreshold,
    );

    // For high-similarity matches not already caught by regex, use LLM judge
    for (const match of similarMatches) {
      const alreadyCaught = contradictions.some(
        (c) => c.priorDecision.id === match.decision.id,
      );
      if (alreadyCaught) continue;

      if (options.modelClient) {
        // Step 4: LLM judge for ambiguous cases
        try {
          const judgeResult = await judgeContradiction(
            match.decision,
            responseText,
            options.modelClient,
          );

          if (judgeResult && judgeResult.contradicts && judgeResult.confidence >= confidenceThreshold) {
            contradictions.push({
              isContradiction: true,
              confidence: judgeResult.confidence,
              reason: judgeResult.reason,
              priorDecision: match.decision,
              relevantExcerpt: extractRelevantExcerpt(responseText, match.decision),
            });
          }
        } catch {
          // Fail silently — already tried simple check
        }
      }
    }
  } catch {
    // Embedding scoring failed — we still have regex results
  }

  // Filter by confidence threshold and sort
  return contradictions
    .filter((c) => c.confidence >= confidenceThreshold)
    .sort((a, b) => b.confidence - a.confidence);
}

/**
 * Extract the most relevant excerpt from the response text
 * that relates to a specific decision.
 */
function extractRelevantExcerpt(responseText: string, decision: Decision): string {
  const entities = decision.commitment.toLowerCase().split(/\s+/);
  const sentences = responseText.split(/[.!?\n]+/).filter((s) => s.trim().length > 0);

  // Find the sentence most relevant to the decision
  let bestSentence = '';
  let bestScore = 0;

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    let score = 0;
    for (const entity of entities) {
      if (entity.length > 2 && lower.includes(entity)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestSentence = sentence.trim();
    }
  }

  if (bestSentence) {
    return bestSentence.substring(0, 200);
  }

  // Fallback: return first 200 chars
  return responseText.substring(0, 200);
}

export { checkSimpleContradiction, entityPreFilter, findSimilarDecisions } from './similarity.js';
export { judgeContradiction } from './judge.js';
