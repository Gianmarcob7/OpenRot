import { describe, it, expect } from 'vitest';
import {
  parseTranscriptContent,
  getMessageText,
  getLastAssistantResponses,
  countTurns,
  getUserMessages,
  getAssistantMessages,
} from '../../src/transcript/index.js';
import {
  estimateTokens,
  estimateTotalTokens,
  estimateSaturation,
  countHedgingPhrases,
  detectShrinkingResponses,
} from '../../src/transcript/tokens.js';

const SAMPLE_JSONL = [
  '{"type":"user","message":{"role":"user","content":"Let\'s use Tailwind for styling."},"timestamp":"2026-03-10T10:00:00Z"}',
  '{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"Sure! I\'ll set up Tailwind CSS for the project."}]},"timestamp":"2026-03-10T10:00:05Z"}',
  '{"type":"user","message":{"role":"user","content":"Now build the auth system."},"timestamp":"2026-03-10T10:01:00Z"}',
  '{"type":"assistant","message":{"role":"assistant","content":"I\'ll implement JWT authentication with httpOnly cookies.","timestamp":"2026-03-10T10:01:05Z"}',  // note: content is a string here intentionally
].join('\n');

describe('transcript parser', () => {
  it('parses valid JSONL lines', () => {
    const messages = parseTranscriptContent(SAMPLE_JSONL);
    // The last line has a syntax issue (timestamp inside message), but JSON is valid
    expect(messages.length).toBeGreaterThanOrEqual(3);
  });

  it('handles string content', () => {
    const content = '{"type":"user","message":{"role":"user","content":"Hello"},"timestamp":"2026-01-01T00:00:00Z"}';
    const messages = parseTranscriptContent(content);
    expect(messages).toHaveLength(1);
    expect(getMessageText(messages[0])).toBe('Hello');
  });

  it('handles array content', () => {
    const content = '{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"World"}]},"timestamp":"2026-01-01T00:00:00Z"}';
    const messages = parseTranscriptContent(content);
    expect(messages).toHaveLength(1);
    expect(getMessageText(messages[0])).toBe('World');
  });

  it('skips malformed lines', () => {
    const content = 'not json\n{"type":"user","message":{"role":"user","content":"ok"},"timestamp":"ts"}\ngarbage';
    const messages = parseTranscriptContent(content);
    expect(messages).toHaveLength(1);
  });

  it('counts turns as assistant messages', () => {
    const content = [
      '{"type":"user","message":{"role":"user","content":"a"},"timestamp":"ts1"}',
      '{"type":"assistant","message":{"role":"assistant","content":"b"},"timestamp":"ts2"}',
      '{"type":"user","message":{"role":"user","content":"c"},"timestamp":"ts3"}',
      '{"type":"assistant","message":{"role":"assistant","content":"d"},"timestamp":"ts4"}',
    ].join('\n');
    const messages = parseTranscriptContent(content);
    expect(countTurns(messages)).toBe(2);
  });

  it('gets last N assistant responses', () => {
    const content = [
      '{"type":"assistant","message":{"role":"assistant","content":"first"},"timestamp":"ts1"}',
      '{"type":"assistant","message":{"role":"assistant","content":"second"},"timestamp":"ts2"}',
      '{"type":"assistant","message":{"role":"assistant","content":"third"},"timestamp":"ts3"}',
    ].join('\n');
    const messages = parseTranscriptContent(content);
    const last2 = getLastAssistantResponses(messages, 2);
    expect(last2).toEqual(['second', 'third']);
  });

  it('gets user messages', () => {
    const content = [
      '{"type":"user","message":{"role":"user","content":"q1"},"timestamp":"ts1"}',
      '{"type":"assistant","message":{"role":"assistant","content":"a1"},"timestamp":"ts2"}',
      '{"type":"user","message":{"role":"user","content":"q2"},"timestamp":"ts3"}',
    ].join('\n');
    const messages = parseTranscriptContent(content);
    expect(getUserMessages(messages)).toEqual(['q1', 'q2']);
  });

  it('returns empty for empty input', () => {
    expect(parseTranscriptContent('')).toEqual([]);
  });
});

describe('token estimation', () => {
  it('estimates tokens from text length', () => {
    // 100 chars / 4 = 25 tokens
    const text = 'a'.repeat(100);
    expect(estimateTokens(text)).toBe(25);
  });

  it('estimates total tokens from messages', () => {
    const content = [
      '{"type":"user","message":{"role":"user","content":"' + 'a'.repeat(100) + '"},"timestamp":"ts1"}',
      '{"type":"assistant","message":{"role":"assistant","content":"' + 'b'.repeat(200) + '"},"timestamp":"ts2"}',
    ].join('\n');
    const messages = parseTranscriptContent(content);
    const total = estimateTotalTokens(messages);
    expect(total).toBe(75); // 25 + 50
  });

  it('estimates saturation percentage', () => {
    const content = '{"type":"user","message":{"role":"user","content":"' + 'a'.repeat(400000) + '"},"timestamp":"ts1"}';
    const messages = parseTranscriptContent(content);
    const saturation = estimateSaturation(messages);
    expect(saturation).toBe(50); // 100000 / 200000 * 100
  });

  it('caps saturation at 100', () => {
    const content = '{"type":"user","message":{"role":"user","content":"' + 'a'.repeat(1000000) + '"},"timestamp":"ts1"}';
    const messages = parseTranscriptContent(content);
    expect(estimateSaturation(messages)).toBe(100);
  });
});

describe('hedging detection', () => {
  it('counts hedging phrases', () => {
    const text = 'I think this might be correct. Perhaps we should try it. Maybe it works.';
    expect(countHedgingPhrases(text)).toBe(4);
  });

  it('returns 0 for confident text', () => {
    const text = 'Here is the implementation. This function handles the authentication flow.';
    expect(countHedgingPhrases(text)).toBe(0);
  });
});

describe('shrinking response detection', () => {
  it('detects severely shrinking responses', () => {
    const responses = [
      'a'.repeat(1000),
      'a'.repeat(900),
      'a'.repeat(800),
      'a'.repeat(200),
      'a'.repeat(100),
      'a'.repeat(50),
    ];
    const ratio = detectShrinkingResponses(responses);
    expect(ratio).toBeGreaterThan(0);
  });

  it('returns 0 for consistent lengths', () => {
    const responses = [
      'a'.repeat(500),
      'a'.repeat(500),
      'a'.repeat(500),
      'a'.repeat(500),
    ];
    expect(detectShrinkingResponses(responses)).toBe(0);
  });

  it('returns 0 for too few responses', () => {
    expect(detectShrinkingResponses(['short', 'also short'])).toBe(0);
  });
});
