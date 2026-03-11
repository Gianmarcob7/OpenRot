import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDatabase } from '../../src/db/index.js';
import { SessionStore } from '../../src/db/sessions.js';
import { DecisionStore } from '../../src/db/decisions.js';
import { WarningStore } from '../../src/db/warnings.js';
import { scoreContradictions } from '../../src/scoring/contradictions.js';
import type { Database } from 'sql.js';

describe('contradiction scoring (Signal A)', () => {
  let db: Database;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  afterEach(() => {
    db.close();
  });

  it('returns 0 for no decisions', () => {
    const sessionStore = new SessionStore(db);
    const session = sessionStore.create('test');
    expect(scoreContradictions(db, session.id)).toBe(0);
  });

  it('returns 0 for decisions with no warnings', () => {
    const sessionStore = new SessionStore(db);
    const decisionStore = new DecisionStore(db);
    const session = sessionStore.create('test');

    decisionStore.create(session.id, 1, {
      commitment: 'use Tailwind',
      type: 'use',
      confidence: 0.8,
      rawText: 'test',
      source: 'regex',
    });

    expect(scoreContradictions(db, session.id)).toBe(0);
  });

  it('scores based on contradiction ratio', () => {
    const sessionStore = new SessionStore(db);
    const decisionStore = new DecisionStore(db);
    const warningStore = new WarningStore(db);
    const session = sessionStore.create('test');

    // 2 decisions
    const d1 = decisionStore.create(session.id, 1, {
      commitment: 'use Tailwind',
      type: 'use',
      confidence: 0.8,
      rawText: 'test',
      source: 'regex',
    });

    decisionStore.create(session.id, 1, {
      commitment: 'use PostgreSQL',
      type: 'use',
      confidence: 0.8,
      rawText: 'test',
      source: 'regex',
    });

    // 1 warning = 50% contradiction rate = score 50
    warningStore.create(session.id, 2, d1.id, 0.85, 'contradiction');

    const score = scoreContradictions(db, session.id);
    expect(score).toBe(50);
  });

  it('caps at 100', () => {
    const sessionStore = new SessionStore(db);
    const decisionStore = new DecisionStore(db);
    const warningStore = new WarningStore(db);
    const session = sessionStore.create('test');

    const d1 = decisionStore.create(session.id, 1, {
      commitment: 'use Tailwind',
      type: 'use',
      confidence: 0.8,
      rawText: 'test',
      source: 'regex',
    });

    // More warnings than decisions
    warningStore.create(session.id, 2, d1.id, 0.85, 'contradiction 1');
    warningStore.create(session.id, 3, d1.id, 0.9, 'contradiction 2');

    const score = scoreContradictions(db, session.id);
    expect(score).toBe(100);
  });
});
