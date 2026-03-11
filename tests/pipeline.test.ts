import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDatabase } from '../src/db/index.js';
import { processTurn, resetFirstWarning } from '../src/pipeline.js';
import type Database from 'better-sqlite3';

describe('pipeline', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDatabase();
    resetFirstWarning();
  });

  afterEach(() => {
    db.close();
  });

  it('extracts decisions from a message', async () => {
    // First, create a session
    db.prepare('INSERT INTO sessions (id, created_at, editor) VALUES (?, ?, ?)').run(
      'test-session',
      Date.now(),
      'test',
    );

    const result = await processTurn('test-session', 1, "Let's use Tailwind for styling.", {
      db,
      modelClient: null,
      extractionMode: 'regex',
      threshold: 0.75,
      sensitivity: 'medium',
    });

    expect(result.decisionsExtracted).toBeGreaterThanOrEqual(1);
    expect(result.hasWarning).toBe(false);
  });

  it('detects a contradiction', async () => {
    db.prepare('INSERT INTO sessions (id, created_at, editor) VALUES (?, ?, ?)').run(
      'test-session',
      Date.now(),
      'test',
    );

    // Turn 1: establish a decision
    await processTurn('test-session', 1, "Let's use Tailwind for styling.", {
      db,
      modelClient: null,
      extractionMode: 'regex',
      threshold: 0.75,
      sensitivity: 'medium',
    });

    // Turn 2: contradict it
    const result = await processTurn(
      'test-session',
      2,
      "Here's the component with inline styles: style={{color: 'red', padding: '10px'}}",
      {
        db,
        modelClient: null,
        extractionMode: 'regex',
        threshold: 0.75,
        sensitivity: 'medium',
      },
    );

    expect(result.hasWarning).toBe(true);
    expect(result.warning).toBeDefined();
    expect(result.warning!.priorDecision.toLowerCase()).toContain('tailwind');
    expect(result.warning!.confidence).toBeGreaterThan(0);
  });

  it('does not fire a warning for consistent usage', async () => {
    db.prepare('INSERT INTO sessions (id, created_at, editor) VALUES (?, ?, ?)').run(
      'test-session',
      Date.now(),
      'test',
    );

    await processTurn('test-session', 1, "Let's use Tailwind for styling.", {
      db,
      modelClient: null,
      extractionMode: 'regex',
      threshold: 0.75,
      sensitivity: 'medium',
    });

    const result = await processTurn(
      'test-session',
      2,
      "Here's the Tailwind classes for the component: className='bg-blue-500 text-white p-4'",
      {
        db,
        modelClient: null,
        extractionMode: 'regex',
        threshold: 0.75,
        sensitivity: 'medium',
      },
    );

    expect(result.hasWarning).toBe(false);
  });

  it('includes first-run explanation on the first warning', async () => {
    db.prepare('INSERT INTO sessions (id, created_at, editor) VALUES (?, ?, ?)').run(
      'test-session',
      Date.now(),
      'test',
    );

    await processTurn('test-session', 1, "Let's use PostgreSQL for the database.", {
      db,
      modelClient: null,
      extractionMode: 'regex',
      threshold: 0.75,
      sensitivity: 'medium',
    });

    const result = await processTurn(
      'test-session',
      2,
      'Let me create the SQLite database connection for you.',
      {
        db,
        modelClient: null,
        extractionMode: 'regex',
        threshold: 0.75,
        sensitivity: 'medium',
      },
    );

    expect(result.hasWarning).toBe(true);
    expect(result.warning!.reason).toContain('OpenRot caught this');
  });

  it('does not include first-run explanation on subsequent warnings', async () => {
    db.prepare('INSERT INTO sessions (id, created_at, editor) VALUES (?, ?, ?)').run(
      'test-session',
      Date.now(),
      'test',
    );

    await processTurn('test-session', 1, "Let's use PostgreSQL. Use UUIDs for all primary keys.", {
      db,
      modelClient: null,
      extractionMode: 'regex',
      threshold: 0.75,
      sensitivity: 'medium',
    });

    // First contradiction
    await processTurn(
      'test-session',
      2,
      'Let me create the SQLite database connection for you.',
      {
        db,
        modelClient: null,
        extractionMode: 'regex',
        threshold: 0.75,
        sensitivity: 'medium',
      },
    );

    // Second contradiction
    const result = await processTurn(
      'test-session',
      3,
      'CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT)',
      {
        db,
        modelClient: null,
        extractionMode: 'regex',
        threshold: 0.75,
        sensitivity: 'medium',
      },
    );

    if (result.hasWarning) {
      expect(result.warning!.reason).not.toContain('OpenRot caught this');
    }
  });

  it('handles empty messages gracefully', async () => {
    db.prepare('INSERT INTO sessions (id, created_at, editor) VALUES (?, ?, ?)').run(
      'test-session',
      Date.now(),
      'test',
    );

    const result = await processTurn('test-session', 1, '', {
      db,
      modelClient: null,
      extractionMode: 'regex',
      threshold: 0.75,
      sensitivity: 'medium',
    });

    expect(result.hasWarning).toBe(false);
    expect(result.decisionsExtracted).toBe(0);
  });

  it('does not duplicate decisions across turns', async () => {
    db.prepare('INSERT INTO sessions (id, created_at, editor) VALUES (?, ?, ?)').run(
      'test-session',
      Date.now(),
      'test',
    );

    await processTurn('test-session', 1, "Let's use Tailwind.", {
      db,
      modelClient: null,
      extractionMode: 'regex',
      threshold: 0.75,
      sensitivity: 'medium',
    });

    const result = await processTurn('test-session', 2, "Let's use Tailwind.", {
      db,
      modelClient: null,
      extractionMode: 'regex',
      threshold: 0.75,
      sensitivity: 'medium',
    });

    // Second mention should not create a new decision
    expect(result.decisionsExtracted).toBe(0);
  });
});
