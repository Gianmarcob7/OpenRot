import { describe, it, expect } from 'vitest';
import { scoreRepetitionFast } from '../../src/scoring/repetition.js';

describe('repetition scoring (Signal B) — fast mode', () => {
  it('returns 0 for fewer than 2 responses', () => {
    expect(scoreRepetitionFast([])).toBe(0);
    expect(scoreRepetitionFast(['single response'])).toBe(0);
  });

  it('scores identical responses near 100', () => {
    const identical = Array(5).fill('This is the exact same response repeated verbatim with enough words for jaccard');
    const score = scoreRepetitionFast(identical);
    expect(score).toBe(100);
  });

  it('scores very different responses near 0', () => {
    const different = [
      'Implementing database schema PostgreSQL migrations',
      'React frontend component library Tailwind styles',
      'Authentication JWT tokens httpOnly cookies security',
      'Kubernetes deployment Docker containerization orchestration',
      'Machine learning neural network training inference',
    ];
    const score = scoreRepetitionFast(different);
    expect(score).toBeLessThan(30);
  });

  it('detects partial repetition', () => {
    const similar = [
      'Let me update the database schema with the new fields for users and posts',
      'Now let me update the database schema to add indexes for the users table',
      'I will update the database schema with foreign key constraints for posts',
    ];
    const score = scoreRepetitionFast(similar);
    expect(score).toBeGreaterThan(30);
    expect(score).toBeLessThan(100);
  });

  it('only uses the last 5 responses', () => {
    const responses = [
      'completely unique response alpha',
      'completely unique response beta',
      'completely unique response gamma',
      'completely unique response delta',
      'completely unique response epsilon',
      'identical repeated text here now',
      'identical repeated text here now',
    ];
    // Should only consider last 5, which includes 2 identical ones among 5
    const score = scoreRepetitionFast(responses);
    expect(score).toBeGreaterThan(0);
  });
});
