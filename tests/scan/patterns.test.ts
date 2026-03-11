import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { findPatternsForDecision } from '../../src/scan/patterns.js';
import { scanFiles } from '../../src/scan/index.js';
import { writeDecisions, MARKER_START, MARKER_END } from '../../src/sync/writers.js';
import type { Decision } from '../../src/types.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('scan patterns', () => {
  it('finds Tailwind patterns', () => {
    const patterns = findPatternsForDecision('use Tailwind CSS');
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns[0].description).toContain('inline');
  });

  it('finds PostgreSQL patterns', () => {
    const patterns = findPatternsForDecision('use PostgreSQL for database');
    expect(patterns.length).toBeGreaterThan(0);
  });

  it('finds UUID patterns', () => {
    const patterns = findPatternsForDecision('use UUIDs for primary keys');
    expect(patterns.length).toBeGreaterThan(0);
  });

  it('finds npm patterns', () => {
    const patterns = findPatternsForDecision('npm only');
    expect(patterns.length).toBeGreaterThan(0);
  });

  it('returns empty for unknown decision', () => {
    const patterns = findPatternsForDecision('something very obscure about formatting');
    expect(patterns.length).toBe(0);
  });
});

describe('file scanning', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openrot-scan-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('detects inline styles when Tailwind is the decision', () => {
    const filePath = path.join(tmpDir, 'Component.tsx');
    fs.writeFileSync(filePath, `
export function Card() {
  return <div style={{ color: 'red' }}>Hello</div>;
}
`, 'utf-8');

    const decisions: Decision[] = [{
      id: '1',
      sessionId: 's1',
      turn: 1,
      rawText: 'use tailwind',
      commitment: 'use Tailwind CSS',
      type: 'use',
      confidence: 0.8,
      embedding: null,
      source: 'regex',
      createdAt: Date.now(),
    }];

    const violations = scanFiles([filePath], decisions);
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].found).toContain('style');
  });

  it('detects auto-increment when UUID is the decision', () => {
    const filePath = path.join(tmpDir, 'schema.sql');
    fs.writeFileSync(filePath, `
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);
`, 'utf-8');

    const decisions: Decision[] = [{
      id: '1',
      sessionId: 's1',
      turn: 1,
      rawText: 'use uuids',
      commitment: 'use UUIDs for all primary keys',
      type: 'use',
      confidence: 0.8,
      embedding: null,
      source: 'regex',
      createdAt: Date.now(),
    }];

    const violations = scanFiles([filePath], decisions);
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].found).toContain('SERIAL PRIMARY KEY');
  });

  it('returns empty when no violations found', () => {
    const filePath = path.join(tmpDir, 'clean.ts');
    fs.writeFileSync(filePath, "export const x = 1;\n", 'utf-8');

    const decisions: Decision[] = [{
      id: '1',
      sessionId: 's1',
      turn: 1,
      rawText: 'use tailwind',
      commitment: 'use Tailwind CSS',
      type: 'use',
      confidence: 0.8,
      embedding: null,
      source: 'regex',
      createdAt: Date.now(),
    }];

    const violations = scanFiles([filePath], decisions);
    expect(violations.length).toBe(0);
  });
});

describe('sync writers', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openrot-sync-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates a new file with decisions', () => {
    const filePath = path.join(tmpDir, 'CLAUDE.md');
    const result = writeDecisions({ label: 'Test', filePath }, ['use React', 'use Tailwind']);

    expect(result).toBe('created');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain(MARKER_START);
    expect(content).toContain(MARKER_END);
    expect(content).toContain('use React');
    expect(content).toContain('use Tailwind');
  });

  it('updates existing block', () => {
    const filePath = path.join(tmpDir, 'CLAUDE.md');

    // Create initial
    writeDecisions({ label: 'Test', filePath }, ['use React']);
    // Update
    const result = writeDecisions({ label: 'Test', filePath }, ['use React', 'use Vue']);

    expect(result).toBe('updated');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('use Vue');
    // Should only have one block
    expect(content.split(MARKER_START).length).toBe(2);
  });

  it('appends to existing file without markers', () => {
    const filePath = path.join(tmpDir, 'CLAUDE.md');
    fs.writeFileSync(filePath, '# My Project\n\nExisting content.\n', 'utf-8');

    writeDecisions({ label: 'Test', filePath }, ['use React']);

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('Existing content');
    expect(content).toContain(MARKER_START);
    expect(content).toContain('use React');
  });
});
