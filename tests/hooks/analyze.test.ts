import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDatabase } from '../../src/db/index.js';
import { computeRotScore, getRotLevel, formatRotOutput } from '../../src/scoring/index.js';
import { SessionStore } from '../../src/db/sessions.js';
import { parseTranscriptContent } from '../../src/transcript/index.js';
import type { Database } from 'sql.js';
import type { RotScore } from '../../src/types.js';

describe('analyze hook / rot score computation', () => {
  let db: Database;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  afterEach(() => {
    db.close();
  });

  it('computes rot score for an empty session', () => {
    const sessionStore = new SessionStore(db);
    const session = sessionStore.create('test');

    const messages = parseTranscriptContent('');
    // Passes empty messages — should bail gracefully
    const score = computeRotScore(db, session.id, []);
    expect(score.combined).toBe(0);
    expect(score.level).toBe('green');
  });

  it('computes rot score for a healthy session', () => {
    const sessionStore = new SessionStore(db);
    const session = sessionStore.create('test');

    const content = [
      '{"type":"user","message":{"role":"user","content":"Build a login page"},"timestamp":"ts1"}',
      '{"type":"assistant","message":{"role":"assistant","content":"Here\'s the login page implementation with a form and validation."},"timestamp":"ts2"}',
    ].join('\n');

    const messages = parseTranscriptContent(content);
    const score = computeRotScore(db, session.id, messages);
    expect(score.level).toBe('green');
    expect(score.combined).toBeLessThan(30);
  });

  it('returns correct turn count', () => {
    const sessionStore = new SessionStore(db);
    const session = sessionStore.create('test');

    const content = [
      '{"type":"user","message":{"role":"user","content":"q1"},"timestamp":"ts1"}',
      '{"type":"assistant","message":{"role":"assistant","content":"a1"},"timestamp":"ts2"}',
      '{"type":"user","message":{"role":"user","content":"q2"},"timestamp":"ts3"}',
      '{"type":"assistant","message":{"role":"assistant","content":"a2"},"timestamp":"ts4"}',
    ].join('\n');

    const messages = parseTranscriptContent(content);
    const score = computeRotScore(db, session.id, messages);
    expect(score.turn).toBe(2);
  });
});

describe('rot level classification', () => {
  it('classifies green (0-30)', () => {
    expect(getRotLevel(0)).toBe('green');
    expect(getRotLevel(15)).toBe('green');
    expect(getRotLevel(30)).toBe('green');
  });

  it('classifies yellow (31-60)', () => {
    expect(getRotLevel(31)).toBe('yellow');
    expect(getRotLevel(45)).toBe('yellow');
    expect(getRotLevel(60)).toBe('yellow');
  });

  it('classifies red (61-100)', () => {
    expect(getRotLevel(61)).toBe('red');
    expect(getRotLevel(80)).toBe('red');
    expect(getRotLevel(100)).toBe('red');
  });
});

describe('rot output formatting', () => {
  it('returns null for green < 15', () => {
    const score: RotScore = {
      contradictionScore: 0,
      repetitionScore: 0,
      saturationScore: 0,
      combined: 10,
      level: 'green',
      turn: 5,
    };
    expect(formatRotOutput(score)).toBeNull();
  });

  it('returns suppressOutput for green >= 15', () => {
    const score: RotScore = {
      contradictionScore: 10,
      repetitionScore: 10,
      saturationScore: 5,
      combined: 20,
      level: 'green',
      turn: 10,
    };
    const output = formatRotOutput(score);
    expect(output).not.toBeNull();
    expect(output!.stdout).toContain('suppressOutput');
    expect(output!.stderr).toBeUndefined();
  });

  it('returns stderr warning for yellow', () => {
    const score: RotScore = {
      contradictionScore: 30,
      repetitionScore: 20,
      saturationScore: 20,
      combined: 47,
      level: 'yellow',
      turn: 20,
    };
    const output = formatRotOutput(score);
    expect(output).not.toBeNull();
    expect(output!.stderr).toContain('47%');
    expect(output!.stderr).toContain('degrading');
  });

  it('returns stderr warning with handoff suggestion for red', () => {
    const score: RotScore = {
      contradictionScore: 50,
      repetitionScore: 40,
      saturationScore: 30,
      combined: 73,
      level: 'red',
      turn: 40,
    };
    const output = formatRotOutput(score);
    expect(output).not.toBeNull();
    expect(output!.stderr).toContain('73%');
    expect(output!.stderr).toContain('openrot handoff');
  });
});
