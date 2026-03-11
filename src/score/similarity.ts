import type { Decision, SimilarityMatch } from '../types.js';
import { cosineSimilarity, generateEmbedding } from '../extract/embedding.js';
import { extractEntities } from '../extract/regex.js';

/**
 * Quick entity-based pre-filter.
 * If the new response doesn't mention any entity from stored decisions,
 * skip deeper scoring entirely (performance optimization).
 */
export function entityPreFilter(responseText: string, decisions: Decision[]): Decision[] {
  const responseEntities = extractEntities(responseText);
  if (responseEntities.length === 0) return decisions; // Can't filter, pass all through

  const responseLower = responseText.toLowerCase();

  const filtered = decisions.filter((decision) => {
    const decisionEntities = extractEntities(decision.commitment);
    if (decisionEntities.length === 0) return true; // No entities to match, keep it
    // Check if any entity from the decision appears in the response
    return decisionEntities.some(
      (entity) => responseLower.includes(entity) || responseEntities.includes(entity),
    );
  });

  // If filtering removed everything, return all decisions — be safe rather than sorry
  return filtered.length > 0 ? filtered : decisions;
}

/**
 * Find decisions with high embedding similarity to the response.
 * Returns decisions above the similarity threshold.
 */
export async function findSimilarDecisions(
  responseText: string,
  decisions: Decision[],
  threshold: number = 0.6,
): Promise<SimilarityMatch[]> {
  const responseEmbedding = await generateEmbedding(responseText);
  if (!responseEmbedding) return [];

  const matches: SimilarityMatch[] = [];

  for (const decision of decisions) {
    if (!decision.embedding) continue;

    const similarity = cosineSimilarity(responseEmbedding, decision.embedding);
    if (similarity >= threshold) {
      matches.push({ decision, similarity });
    }
  }

  // Sort by similarity descending
  matches.sort((a, b) => b.similarity - a.similarity);
  return matches;
}

/**
 * Simple regex-based contradiction checks for common cases.
 * Returns a contradiction reason string or null if no contradiction detected.
 */
export function checkSimpleContradiction(
  decision: Decision,
  responseText: string,
): string | null {
  const commitment = decision.commitment.toLowerCase();
  const response = responseText.toLowerCase();

  // Decision says "use X" but response uses a known alternative
  const contradictionPairs: [string[], string[], string][] = [
    // [decision keywords, response contradiction keywords, reason]
    [
      ['tailwind', 'tailwindcss'],
      ['style=', 'style:', 'inline style', 'inline css', 'styled-components', 'css modules'],
      'Response uses inline/alternative CSS instead of Tailwind',
    ],
    [
      ['postgres', 'postgresql'],
      ['sqlite', 'mysql', 'mongodb', 'mariadb'],
      'Response uses a different database than PostgreSQL',
    ],
    [
      ['sqlite'],
      ['postgres', 'postgresql', 'mysql', 'mongodb'],
      'Response uses a different database than SQLite',
    ],
    [
      ['mysql'],
      ['postgres', 'postgresql', 'sqlite', 'mongodb'],
      'Response uses a different database than MySQL',
    ],
    [
      ['uuid', 'uuids'],
      ['serial', 'auto_increment', 'autoincrement', 'integer primary key'],
      'Response uses auto-increment IDs instead of UUIDs',
    ],
    [
      ['serial', 'auto_increment', 'autoincrement'],
      ['uuid'],
      'Response uses UUIDs instead of auto-increment IDs',
    ],
    [
      ['async/await', 'async await'],
      ['callback', '.then(', 'new promise('],
      'Response uses callbacks/promises instead of async/await',
    ],
    [
      ['rest', 'rest api'],
      ['graphql', 'grpc'],
      'Response uses a different API style than REST',
    ],
    [
      ['graphql'],
      ['rest api', 'express.get', 'express.post', 'app.get(', 'app.post('],
      'Response uses REST instead of GraphQL',
    ],
  ];

  // Check "use X" decisions
  if (decision.type === 'use' || decision.type === 'always' || decision.type === 'architectural') {
    for (const [decisionKeys, responseKeys, reason] of contradictionPairs) {
      const matchesDecision = decisionKeys.some((k) => commitment.includes(k));
      const matchesResponse = responseKeys.some((k) => response.includes(k));
      if (matchesDecision && matchesResponse) {
        return reason;
      }
    }
  }

  // Check "avoid X" / "never X" / "don't use X" decisions
  if (decision.type === 'avoid' || decision.type === 'never') {
    // Extract what should be avoided from the commitment
    const avoidMatch = commitment.match(/(?:avoid|never use|no)\s+(.+)/);
    if (avoidMatch) {
      const avoidedThing = avoidMatch[1].trim();
      if (response.includes(avoidedThing)) {
        return `Response includes "${avoidedThing}" which was explicitly avoided`;
      }
    }

    // Check for auth contradiction
    if (
      (commitment.includes('no auth') ||
        commitment.includes('no authentication') ||
        commitment.includes('avoid auth')) &&
      (response.includes('auth middleware') ||
        response.includes('authentication') ||
        response.includes('passport') ||
        response.includes('jwt'))
    ) {
      return 'Response adds authentication which was explicitly deferred';
    }
  }

  return null;
}

/**
 * Compute a numeric cosine similarity between two Float32Arrays.
 * Re-exported for convenience.
 */
export { cosineSimilarity } from '../extract/embedding.js';
