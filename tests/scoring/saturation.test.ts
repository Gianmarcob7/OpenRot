import { describe, it, expect } from 'vitest';
import { scoreSaturation } from '../../src/scoring/saturation.js';
import { parseTranscriptContent } from '../../src/transcript/index.js';

/**
 * Helper to create mock transcript messages.
 */
function makeMockMessages(
  pairs: Array<{ user: string; assistant: string }>,
) {
  const lines: string[] = [];
  for (const pair of pairs) {
    lines.push(JSON.stringify({
      type: 'user',
      message: { role: 'user', content: pair.user },
      timestamp: new Date().toISOString(),
    }));
    lines.push(JSON.stringify({
      type: 'assistant',
      message: { role: 'assistant', content: pair.assistant },
      timestamp: new Date().toISOString(),
    }));
  }
  return parseTranscriptContent(lines.join('\n'));
}

describe('saturation scoring (Signal C)', () => {
  it('returns 0 for empty messages', () => {
    expect(scoreSaturation([])).toBe(0);
  });

  it('returns low score for few messages', () => {
    const messages = makeMockMessages([
      { user: 'Hello', assistant: 'Hi there, how can I help?' },
    ]);
    const score = scoreSaturation(messages);
    expect(score).toBeLessThan(5);
  });

  it('increases with more messages', () => {
    const shortSession = makeMockMessages([
      { user: 'a'.repeat(500), assistant: 'b'.repeat(2000) },
    ]);
    const longSession = makeMockMessages(
      Array(20).fill({ user: 'a'.repeat(500), assistant: 'b'.repeat(2000) }),
    );

    const shortScore = scoreSaturation(shortSession);
    const longScore = scoreSaturation(longSession);
    expect(longScore).toBeGreaterThan(shortScore);
  });

  it('adds hedging penalty', () => {
    const hedgy = makeMockMessages([
      { user: 'Fix the bug', assistant: 'I think this might be the issue. Perhaps we should investigate. Maybe it will work.' },
      { user: 'Are you sure?', assistant: 'I believe so. Possibly it could be something else. Maybe not.' },
    ]);

    const confident = makeMockMessages([
      { user: 'Fix the bug', assistant: 'Here is the fix. The issue was a null reference in the handler.' },
      { user: 'Works now?', assistant: 'Yes, the test passes and the function returns correctly.' },
    ]);

    const hedgyScore = scoreSaturation(hedgy);
    const confidentScore = scoreSaturation(confident);
    // Hedging should produce a higher (worse) score
    expect(hedgyScore).toBeGreaterThan(confidentScore);
  });

  it('caps at 100', () => {
    const huge = makeMockMessages([
      { user: 'a'.repeat(400_000), assistant: 'b'.repeat(400_000) },
    ]);
    expect(scoreSaturation(huge)).toBe(100);
  });
});
