import type { Decision, ExtractionResult, ContradictionResult, ModelClient, PipelineResult, CheckOutput } from './types.js';
import type Database from 'better-sqlite3';
import { extractDecisions, generateEmbedding } from './extract/index.js';
import { scoreContradictions } from './score/index.js';
import { DecisionStore } from './db/decisions.js';
import { WarningStore } from './db/warnings.js';
import type { ExtractionMode } from './extract/index.js';

interface PipelineOptions {
  db: Database.Database;
  modelClient: ModelClient | null;
  extractionMode: ExtractionMode;
  threshold: number;
  sensitivity: 'low' | 'medium' | 'high';
}

// Track whether we've shown the first-run explanation
const firstWarningShown = new Map<string, boolean>();

/**
 * Process a message through the full OpenRot pipeline:
 * 1. Extract decisions from the message
 * 2. Store new decisions
 * 3. Score against existing decisions for contradictions
 * 4. Create warnings for contradictions above threshold
 * 5. Return structured result
 */
export async function processTurn(
  sessionId: string,
  turn: number,
  message: string,
  options: PipelineOptions,
): Promise<CheckOutput> {
  const decisionStore = new DecisionStore(options.db);
  const warningStore = new WarningStore(options.db);

  // Step 1: Extract decisions from this message
  let newExtractions: ExtractionResult[] = [];
  try {
    newExtractions = await extractDecisions(message, {
      mode: options.extractionMode,
      modelClient: options.modelClient,
    });
  } catch {
    // Fail silently
  }

  // Step 2: Store new decisions (deduplicate against existing)
  const storedDecisions: Decision[] = [];
  for (const extraction of newExtractions) {
    try {
      if (!decisionStore.isDuplicate(sessionId, extraction.commitment)) {
        const decision = decisionStore.create(sessionId, turn, extraction);

        // Generate and store embedding if possible
        try {
          const embedding = await generateEmbedding(extraction.commitment);
          if (embedding) {
            decisionStore.updateEmbedding(decision.id, embedding);
            decision.embedding = embedding;
          }
        } catch {
          // Embedding generation failed — continue without it
        }

        storedDecisions.push(decision);
      }
    } catch {
      // Fail silently on individual decision storage
    }
  }

  // Step 3: Get all existing decisions for this session
  let existingDecisions: Decision[] = [];
  try {
    existingDecisions = decisionStore.getBySessionId(sessionId);
  } catch {
    return {
      hasWarning: false,
      decisionsExtracted: storedDecisions.length,
    };
  }

  // Step 4: Score the message against existing decisions
  let contradictions: ContradictionResult[] = [];
  try {
    contradictions = await scoreContradictions(message, existingDecisions, {
      threshold: options.threshold,
      modelClient: options.modelClient,
      sensitivity: options.sensitivity,
    });
  } catch {
    // Scoring failed — return with just extraction results
    return {
      hasWarning: false,
      decisionsExtracted: storedDecisions.length,
    };
  }

  // Step 5: Create warnings for the highest-confidence contradiction
  if (contradictions.length > 0) {
    const topContradiction = contradictions[0];
    try {
      const warning = warningStore.create(
        sessionId,
        turn,
        topContradiction.priorDecision.id,
        topContradiction.confidence,
        topContradiction.reason,
      );

      const isFirstWarning = !firstWarningShown.get(sessionId);
      if (isFirstWarning) {
        firstWarningShown.set(sessionId, true);
      }

      return {
        hasWarning: true,
        warning: {
          warningId: warning.id,
          priorTurn: topContradiction.priorDecision.turn,
          priorDecision: topContradiction.priorDecision.commitment,
          contradiction: topContradiction.relevantExcerpt,
          confidence: Math.round(topContradiction.confidence * 100) / 100,
          reason: topContradiction.reason
            + (isFirstWarning
              ? '\n\n(OpenRot caught this — it tracks decisions you make during coding sessions. This is the first warning in this session. Type \'openrot status\' to see what\'s being tracked.)'
              : ''),
        },
        decisionsExtracted: storedDecisions.length,
      };
    } catch {
      // Warning creation failed — still return the contradiction info
      return {
        hasWarning: true,
        warning: {
          warningId: 'unknown',
          priorTurn: topContradiction.priorDecision.turn,
          priorDecision: topContradiction.priorDecision.commitment,
          contradiction: topContradiction.relevantExcerpt,
          confidence: Math.round(topContradiction.confidence * 100) / 100,
          reason: topContradiction.reason,
        },
        decisionsExtracted: storedDecisions.length,
      };
    }
  }

  return {
    hasWarning: false,
    decisionsExtracted: storedDecisions.length,
  };
}

/**
 * Format a warning for display in the editor chat panel.
 */
export function formatWarning(output: CheckOutput): string {
  if (!output.hasWarning || !output.warning) return '';

  const w = output.warning;
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  OpenRot — Possible Contradiction

  Earlier (turn ${w.priorTurn}):
  "${w.priorDecision}"

  Now (turn ${w.priorTurn}):
  "${w.contradiction}"

  Confidence: ${Math.round(w.confidence * 100)}%
  Reason: ${w.reason}

  To dismiss: openrot dismiss ${w.warningId}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

/** Reset first-warning tracking (for testing) */
export function resetFirstWarning(): void {
  firstWarningShown.clear();
}
