import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDatabase } from '../../src/db/index.js';
import { SessionStore } from '../../src/db/sessions.js';
import { DecisionStore } from '../../src/db/decisions.js';
import { WarningStore } from '../../src/db/warnings.js';
import type Database from 'better-sqlite3';

describe('database CRUD operations', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDatabase();
  });

  afterEach(() => {
    db.close();
  });

  describe('SessionStore', () => {
    it('creates a session', () => {
      const store = new SessionStore(db);
      const session = store.create('test-editor');

      expect(session.id).toBeDefined();
      expect(session.editor).toBe('test-editor');
      expect(session.createdAt).toBeGreaterThan(0);
      expect(session.endedAt).toBeNull();
    });

    it('gets a session by ID', () => {
      const store = new SessionStore(db);
      const created = store.create('test');
      const found = store.getById(created.id);

      expect(found).not.toBeNull();
      expect(found!.id).toBe(created.id);
    });

    it('returns null for non-existent session', () => {
      const store = new SessionStore(db);
      expect(store.getById('nonexistent')).toBeNull();
    });

    it('lists all sessions', () => {
      const store = new SessionStore(db);
      store.create('editor1');
      store.create('editor2');

      const all = store.getAll();
      expect(all.length).toBe(2);
    });

    it('ends a session', () => {
      const store = new SessionStore(db);
      const session = store.create();
      store.end(session.id);

      const found = store.getById(session.id);
      expect(found!.endedAt).not.toBeNull();
    });

    it('deletes a session and cascades', () => {
      const store = new SessionStore(db);
      const decisionStore = new DecisionStore(db);
      const session = store.create();

      decisionStore.create(session.id, 1, {
        commitment: 'test',
        type: 'use',
        confidence: 0.8,
        rawText: 'test',
        source: 'regex',
      });

      store.delete(session.id);
      expect(store.getById(session.id)).toBeNull();
      expect(decisionStore.getBySessionId(session.id).length).toBe(0);
    });
  });

  describe('DecisionStore', () => {
    it('creates a decision', () => {
      const store = new DecisionStore(db);
      const sessionStore = new SessionStore(db);
      const session = sessionStore.create();

      const decision = store.create(session.id, 1, {
        commitment: 'use Tailwind',
        type: 'use',
        confidence: 0.8,
        rawText: "let's use Tailwind",
        source: 'regex',
      });

      expect(decision.id).toBeDefined();
      expect(decision.commitment).toBe('use Tailwind');
      expect(decision.type).toBe('use');
    });

    it('gets decisions by session', () => {
      const store = new DecisionStore(db);
      const sessionStore = new SessionStore(db);
      const session = sessionStore.create();

      store.create(session.id, 1, {
        commitment: 'use Tailwind',
        type: 'use',
        confidence: 0.8,
        rawText: 'test',
        source: 'regex',
      });

      store.create(session.id, 2, {
        commitment: 'use PostgreSQL',
        type: 'use',
        confidence: 0.9,
        rawText: 'test',
        source: 'regex',
      });

      const decisions = store.getBySessionId(session.id);
      expect(decisions.length).toBe(2);
    });

    it('checks for duplicates', () => {
      const store = new DecisionStore(db);
      const sessionStore = new SessionStore(db);
      const session = sessionStore.create();

      store.create(session.id, 1, {
        commitment: 'use Tailwind',
        type: 'use',
        confidence: 0.8,
        rawText: 'test',
        source: 'regex',
      });

      expect(store.isDuplicate(session.id, 'use Tailwind')).toBe(true);
      expect(store.isDuplicate(session.id, 'USE TAILWIND')).toBe(true);
      expect(store.isDuplicate(session.id, 'use PostgreSQL')).toBe(false);
    });

    it('stores and retrieves embeddings', () => {
      const store = new DecisionStore(db);
      const sessionStore = new SessionStore(db);
      const session = sessionStore.create();

      const decision = store.create(session.id, 1, {
        commitment: 'test',
        type: 'use',
        confidence: 0.8,
        rawText: 'test',
        source: 'regex',
      });

      const embedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);
      store.updateEmbedding(decision.id, embedding);

      const retrieved = store.getById(decision.id);
      expect(retrieved!.embedding).not.toBeNull();
      expect(retrieved!.embedding!.length).toBe(4);
      expect(retrieved!.embedding![0]).toBeCloseTo(0.1, 2);
    });
  });

  describe('WarningStore', () => {
    it('creates a warning', () => {
      const sessionStore = new SessionStore(db);
      const decisionStore = new DecisionStore(db);
      const warningStore = new WarningStore(db);
      const session = sessionStore.create();

      const decision = decisionStore.create(session.id, 1, {
        commitment: 'test',
        type: 'use',
        confidence: 0.8,
        rawText: 'test',
        source: 'regex',
      });

      const warning = warningStore.create(session.id, 2, decision.id, 0.85, 'test reason');

      expect(warning.id).toBeDefined();
      expect(warning.confidence).toBe(0.85);
      expect(warning.dismissed).toBe(false);
    });

    it('dismisses a warning', () => {
      const sessionStore = new SessionStore(db);
      const decisionStore = new DecisionStore(db);
      const warningStore = new WarningStore(db);
      const session = sessionStore.create();

      const decision = decisionStore.create(session.id, 1, {
        commitment: 'test',
        type: 'use',
        confidence: 0.8,
        rawText: 'test',
        source: 'regex',
      });

      const warning = warningStore.create(session.id, 2, decision.id, 0.85, 'test');
      const success = warningStore.dismiss(warning.id);

      expect(success).toBe(true);
      const found = warningStore.getById(warning.id);
      expect(found!.dismissed).toBe(true);
    });

    it('counts warnings', () => {
      const sessionStore = new SessionStore(db);
      const decisionStore = new DecisionStore(db);
      const warningStore = new WarningStore(db);
      const session = sessionStore.create();

      const decision = decisionStore.create(session.id, 1, {
        commitment: 'test',
        type: 'use',
        confidence: 0.8,
        rawText: 'test',
        source: 'regex',
      });

      warningStore.create(session.id, 2, decision.id, 0.85, 'warning 1');
      warningStore.create(session.id, 3, decision.id, 0.9, 'warning 2');

      expect(warningStore.countBySessionId(session.id)).toBe(2);
    });

    it('gets active warnings only', () => {
      const sessionStore = new SessionStore(db);
      const decisionStore = new DecisionStore(db);
      const warningStore = new WarningStore(db);
      const session = sessionStore.create();

      const decision = decisionStore.create(session.id, 1, {
        commitment: 'test',
        type: 'use',
        confidence: 0.8,
        rawText: 'test',
        source: 'regex',
      });

      const w1 = warningStore.create(session.id, 2, decision.id, 0.85, 'warning 1');
      warningStore.create(session.id, 3, decision.id, 0.9, 'warning 2');
      warningStore.dismiss(w1.id);

      const active = warningStore.getActiveBySessionId(session.id);
      expect(active.length).toBe(1);
    });
  });
});
