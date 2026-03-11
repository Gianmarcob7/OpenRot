import type { ScanPattern } from '../types.js';

/**
 * Map decision types to scan patterns.
 * Each pattern defines which files to check and what violations to look for.
 */
export const SCAN_PATTERNS: ScanPattern[] = [
  // Styling decisions
  {
    decisionKeywords: ['tailwind', 'tailwindcss'],
    fileGlobs: ['**/*.tsx', '**/*.jsx', '**/*.ts', '**/*.js', '**/*.vue', '**/*.svelte'],
    violationPatterns: [
      /style\s*=\s*\{\{/g,
      /style\s*=\s*"/g,
      /styled-components/g,
      /import.*\.module\.css/g,
      /import.*\.module\.scss/g,
      /from\s+['"]styled-components['"]/g,
      /from\s+['"]@emotion/g,
    ],
    description: 'inline/alternative CSS instead of Tailwind',
  },
  {
    decisionKeywords: ['inline style', 'inline css'],
    fileGlobs: ['**/*.tsx', '**/*.jsx'],
    violationPatterns: [
      /className\s*=/g,
      /from\s+['"]tailwindcss['"]/g,
    ],
    description: 'Tailwind/className instead of inline styles',
  },
  {
    decisionKeywords: ['styled-components'],
    fileGlobs: ['**/*.tsx', '**/*.jsx', '**/*.ts'],
    violationPatterns: [
      /style\s*=\s*\{\{/g,
      /className\s*=/g,
    ],
    description: 'non-styled-components styling',
  },

  // Database decisions
  {
    decisionKeywords: ['postgres', 'postgresql'],
    fileGlobs: ['**/*.ts', '**/*.js', '**/*.sql'],
    violationPatterns: [
      /sqlite/gi,
      /mysql/gi,
      /mongodb/gi,
      /from\s+['"]better-sqlite3['"]/g,
      /from\s+['"]mysql2?['"]/g,
      /from\s+['"]mongoose['"]/g,
    ],
    description: 'non-PostgreSQL database',
  },
  {
    decisionKeywords: ['sqlite'],
    fileGlobs: ['**/*.ts', '**/*.js', '**/*.sql'],
    violationPatterns: [
      /postgres/gi,
      /mysql/gi,
      /mongodb/gi,
    ],
    description: 'non-SQLite database',
  },

  // ID decisions
  {
    decisionKeywords: ['uuid', 'uuids'],
    fileGlobs: ['**/*.ts', '**/*.js', '**/*.sql'],
    violationPatterns: [
      /SERIAL\s+PRIMARY\s+KEY/gi,
      /AUTO_INCREMENT/gi,
      /autoIncrement/g,
      /INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi,
    ],
    description: 'auto-increment IDs instead of UUIDs',
  },
  {
    decisionKeywords: ['serial', 'auto_increment', 'autoincrement'],
    fileGlobs: ['**/*.ts', '**/*.js', '**/*.sql'],
    violationPatterns: [
      /uuid/gi,
      /from\s+['"]uuid['"]/g,
      /crypto\.randomUUID/g,
    ],
    description: 'UUIDs instead of auto-increment IDs',
  },

  // Package manager decisions
  {
    decisionKeywords: ['npm only', 'only npm', 'use npm'],
    fileGlobs: ['**/yarn.lock', '**/pnpm-lock.yaml', '**/.yarnrc*', '**/.pnpmfile*'],
    violationPatterns: [/.+/g], // Any content in these files is a violation
    description: 'non-npm package manager files',
  },
  {
    decisionKeywords: ['yarn only', 'only yarn', 'use yarn'],
    fileGlobs: ['**/package-lock.json', '**/pnpm-lock.yaml'],
    violationPatterns: [/.+/g],
    description: 'non-yarn package manager files',
  },

  // Framework decisions
  {
    decisionKeywords: ['react query', 'tanstack query'],
    fileGlobs: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    violationPatterns: [
      /from\s+['"]swr['"]/g,
      /import.*useSWR/g,
    ],
    description: 'SWR instead of React Query',
  },
  {
    decisionKeywords: ['swr'],
    fileGlobs: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    violationPatterns: [
      /from\s+['"]@tanstack\/react-query['"]/g,
      /from\s+['"]react-query['"]/g,
      /useQuery/g,
    ],
    description: 'React Query instead of SWR',
  },
  {
    decisionKeywords: ['express'],
    fileGlobs: ['**/*.ts', '**/*.js'],
    violationPatterns: [
      /from\s+['"]fastify['"]/g,
      /from\s+['"]koa['"]/g,
      /from\s+['"]hapi['"]/g,
    ],
    description: 'non-Express server framework',
  },

  // Auth decisions
  {
    decisionKeywords: ['jwt', 'httponly cookies', 'httponly cookie'],
    fileGlobs: ['**/*.ts', '**/*.js'],
    violationPatterns: [
      /localStorage\.setItem.*token/gi,
      /sessionStorage\.setItem.*token/gi,
    ],
    description: 'token stored in localStorage instead of httpOnly cookie',
  },
  {
    decisionKeywords: ['no auth', 'no authentication', 'avoid auth'],
    fileGlobs: ['**/*.ts', '**/*.js'],
    violationPatterns: [
      /from\s+['"]passport['"]/g,
      /from\s+['"]jsonwebtoken['"]/g,
      /jwt\.verify/g,
      /bcrypt/g,
      /auth\s*middleware/gi,
    ],
    description: 'authentication code despite being deferred',
  },
];

/**
 * Find matching scan patterns for a given decision commitment.
 */
export function findPatternsForDecision(commitment: string): ScanPattern[] {
  const lowerCommitment = commitment.toLowerCase();
  return SCAN_PATTERNS.filter((pattern) =>
    pattern.decisionKeywords.some((keyword) => lowerCommitment.includes(keyword)),
  );
}
