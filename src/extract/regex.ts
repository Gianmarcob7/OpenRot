import type { ExtractionResult, DecisionType } from '../types.js';

interface RegexPattern {
  pattern: RegExp;
  type: DecisionType;
  extractCommitment: (match: RegExpMatchArray) => string;
}

const PATTERNS: RegexPattern[] = [
  {
    // "let's use X" / "let's use X for Y"
    pattern: /let['’]?s\s+use\s+(.+?)(?:\s+for\s+(.+?))?(?:\.\s|$|,)/gi,
    type: 'use',
    extractCommitment: (m) =>
      m[2] ? `use ${m[1].trim()} for ${m[2].trim()}` : `use ${m[1].trim()}`,
  },
  {
    // "we agreed to X" / "we decided to X" / "we agreed on X" / "we decided on X"
    pattern: /we\s+(?:agreed|decided)\s+(?:to|on)\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'use',
    extractCommitment: (m) => m[1].trim(),
  },
  {
    // "don't use X" / "do not use X"
    pattern: /(?:don['’]?t|do\s+not)\s+use\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'avoid',
    extractCommitment: (m) => `avoid ${m[1].trim()}`,
  },
  {
    // "never use X"
    pattern: /never\s+use\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'never',
    extractCommitment: (m) => `never use ${m[1].trim()}`,
  },
  {
    // "avoid X"
    pattern: /(?:^|\.\s+|,\s+)avoid\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'avoid',
    extractCommitment: (m) => `avoid ${m[1].trim()}`,
  },
  {
    // "always X"
    pattern: /always\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'always',
    extractCommitment: (m) => `always ${m[1].trim()}`,
  },
  {
    // "use X for all Y"
    pattern: /use\s+(.+?)\s+for\s+all\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'use',
    extractCommitment: (m) => `use ${m[1].trim()} for all ${m[2].trim()}`,
  },
  {
    // "X only" / "only use X"
    pattern: /only\s+use\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'use',
    extractCommitment: (m) => `only use ${m[1].trim()}`,
  },
  {
    // "we're using X" (architectural statement)
    pattern: /we['’]?re\s+using\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'architectural',
    extractCommitment: (m) => `using ${m[1].trim()}`,
  },
  {
    // "X is our Y" (e.g. "postgres is our database")
    pattern: /(\w[\w\s]*?)\s+is\s+our\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'architectural',
    extractCommitment: (m) => `${m[1].trim()} is our ${m[2].trim()}`,
  },
  {
    // "no X" at start of sentence
    pattern: /(?:^|\.\s+)no\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'avoid',
    extractCommitment: (m) => `no ${m[1].trim()}`,
  },
  {
    // "stick with X"
    pattern: /stick\s+with\s+(.+?)(?:\.\s|$|,)/gi,
    type: 'use',
    extractCommitment: (m) => `stick with ${m[1].trim()}`,
  },
];

/**
 * Extract decisions from text using regex heuristics (Tier 0).
 * Always active, zero cost.
 */
export function extractWithRegex(text: string): ExtractionResult[] {
  const results: ExtractionResult[] = [];
  const seen = new Set<string>();

  for (const { pattern, type, extractCommitment } of PATTERNS) {
    // Reset regex lastIndex for global patterns
    pattern.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const commitment = extractCommitment(match);

      // Skip very short or empty commitments
      if (commitment.length < 3) continue;

      // Deduplicate within this extraction
      const normalized = commitment.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);

      results.push({
        commitment,
        type,
        confidence: 0.8,
        rawText: match[0].trim(),
        source: 'regex',
      });
    }
  }

  return results;
}

/**
 * Extract entities (nouns/technology names) from a text for pre-filtering.
 */
export function extractEntities(text: string): string[] {
  const entities: string[] = [];

  // Common technology/tool names pattern (capitalized words, acronyms, known tools)
  const techPattern = /\b([A-Z][a-zA-Z]*(?:\.[a-zA-Z]+)*|[A-Z]{2,}|[a-z]+(?:SQL|DB|JS|TS|CSS|HTML))\b/g;
  let match;
  while ((match = techPattern.exec(text)) !== null) {
    entities.push(match[1].toLowerCase());
  }

  // Common programming terms that might be lowercase
  const terms = [
    'tailwind', 'postgres', 'postgresql', 'mysql', 'sqlite', 'mongodb',
    'redis', 'docker', 'kubernetes', 'react', 'vue', 'angular', 'svelte',
    'express', 'fastify', 'nest', 'next', 'nuxt', 'vite', 'webpack',
    'typescript', 'javascript', 'python', 'rust', 'golang',
    'uuid', 'serial', 'auto_increment', 'autoincrement',
    'async', 'await', 'callback', 'promise',
    'rest', 'graphql', 'grpc', 'websocket',
    'jwt', 'oauth', 'auth', 'authentication', 'authorization',
    'css', 'scss', 'sass', 'less', 'styled-components',
    'inline styles', 'inline css', 'tailwindcss',
  ];

  const lowerText = text.toLowerCase();
  for (const term of terms) {
    if (lowerText.includes(term)) {
      entities.push(term);
    }
  }

  return [...new Set(entities)];
}
