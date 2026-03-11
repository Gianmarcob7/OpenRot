import type { ScanViolation, Decision } from '../types.js';
import { findPatternsForDecision } from './patterns.js';
import fs from 'fs';
import path from 'path';

/** Directories to always skip when scanning */
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.next', '.nuxt', 'dist', 'build',
  'out', '.cache', '.turbo', 'coverage', '__pycache__',
  '.openrot', '.vscode', '.idea',
]);

/** File extensions to scan */
const SCANNABLE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte',
  '.sql', '.json', '.yaml', '.yml', '.toml', '.lock',
]);

/**
 * Scan a directory against stored decisions for violations.
 */
export function scanDirectory(
  dirPath: string,
  decisions: Decision[],
): ScanViolation[] {
  const violations: ScanViolation[] = [];

  for (const decision of decisions) {
    const patterns = findPatternsForDecision(decision.commitment);
    if (patterns.length === 0) continue;

    for (const pattern of patterns) {
      const files = walkFiles(dirPath);
      for (const filePath of files) {
        const fileViolations = scanFile(filePath, decision.commitment, pattern.violationPatterns, pattern.description);
        violations.push(...fileViolations);
      }
    }
  }

  return deduplicateViolations(violations);
}

/**
 * Scan specific files (for pre-commit hook — staged files only).
 */
export function scanFiles(
  filePaths: string[],
  decisions: Decision[],
): ScanViolation[] {
  const violations: ScanViolation[] = [];

  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) continue;

    for (const decision of decisions) {
      const patterns = findPatternsForDecision(decision.commitment);
      for (const pattern of patterns) {
        const fileViolations = scanFile(filePath, decision.commitment, pattern.violationPatterns, pattern.description);
        violations.push(...fileViolations);
      }
    }
  }

  return deduplicateViolations(violations);
}

/**
 * Scan a single file for violations against a decision.
 */
function scanFile(
  filePath: string,
  decision: string,
  violationPatterns: RegExp[],
  _description: string,
): ScanViolation[] {
  const violations: ScanViolation[] = [];

  try {
    // Check for lock file violations (file existence is the violation)
    const basename = path.basename(filePath);
    if (basename === 'yarn.lock' || basename === 'pnpm-lock.yaml' || basename === 'package-lock.json') {
      violations.push({
        filePath,
        line: 0,
        decision,
        found: `${basename} file exists`,
      });
      return violations;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const pattern of violationPatterns) {
        // Reset regex state
        pattern.lastIndex = 0;
        const match = pattern.exec(line);
        if (match) {
          violations.push({
            filePath,
            line: i + 1,
            decision,
            found: match[0].trim().substring(0, 80),
          });
          break; // One violation per line is enough
        }
      }
    }
  } catch {
    // Can't read file — skip
  }

  return violations;
}

/**
 * Walk a directory recursively to find scannable files.
 */
function walkFiles(dirPath: string): string[] {
  const results: string[] = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;

      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        results.push(...walkFiles(fullPath));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (SCANNABLE_EXTENSIONS.has(ext) || entry.name.endsWith('.lock')) {
          results.push(fullPath);
        }
      }
    }
  } catch {
    // Directory not accessible
  }

  return results;
}

/**
 * Remove duplicate violations.
 */
function deduplicateViolations(violations: ScanViolation[]): ScanViolation[] {
  const seen = new Set<string>();
  return violations.filter((v) => {
    const key = `${v.filePath}:${v.line}:${v.decision}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
