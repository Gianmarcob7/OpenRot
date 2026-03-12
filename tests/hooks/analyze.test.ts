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

    const score = computeRotScore(db, session.id, []);
    expect(score.combined).toBe(0);
    expect(score.level).toBe('healthy');
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
    expect(score.level).toBe('healthy');
    expect(score.combined).toBeLessThanOrEqual(20);
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
  it('classifies healthy (0-20)', () => {
    expect(getRotLevel(0)).toBe('healthy');
    expect(getRotLevel(10)).toBe('healthy');
    expect(getRotLevel(20)).toBe('healthy');
  });

  it('classifies degrading (21-45)', () => {
    expect(getRotLevel(21)).toBe('degrading');
    expect(getRotLevel(30)).toBe('degrading');
    expect(getRotLevel(45)).toBe('degrading');
  });

  it('classifies rotted (46+)', () => {
    expect(getRotLevel(46)).toBe('rotted');
    expect(getRotLevel(80)).toBe('rotted');
    expect(getRotLevel(100)).toBe('rotted');
  });
});

describe('rot output formatting', () => {
  it('returns null for healthy', () => {
    const score: RotScore = {
      violationScore: 0,
      circularScore: 0,
      repairLoopScore: 0,
      qualityScore: 0,
      saturationScore: 0,
      combined: 10,
      level: 'healthy',
      turn: 5,
      rotPoint: null,
    };
    expect(formatRotOutput(score)).toBeNull();
  });

  it('returns stderr warning for degrading', () => {
    const score: RotScore = {
      violationScore: 30,
      circularScore: 20,
      repairLoopScore: 0,
      qualityScore: 10,
      saturationScore: 10,
      combined: 35,
      level: 'degrading',
      turn: 20,
      rotPoint: 15,
    };
    const output = formatRotOutput(score);
    expect(output).not.toBeNull();
    expect(output!.stderr).toContain('35%');
    expect(output!.stderr).toContain('degrading');
  });

  it('returns stderr warning with fix suggestion for rotted', () => {
    const score: RotScore = {
      violationScore: 50,
      circularScore: 40,
      repairLoopScore: 40,
      qualityScore: 20,
      saturationScore: 10,
      combined: 67,
      level: 'rotted',
      turn: 40,
      rotPoint: 31,
    };
    const output = formatRotOutput(score);
    expect(output).not.toBeNull();
    expect(output!.stderr).toContain('67%');
    expect(output!.stderr).toContain('openrot fix');
  });
});
