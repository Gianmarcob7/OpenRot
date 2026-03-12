import { describe, it, expect } from 'vitest';
import { detectViolations, scoreViolations } from '../../src/detect/violations.js';
import { parseAllTurns } from '../../src/detect/index.js';
import { parseTranscriptContent } from '../../src/transcript/index.js';

function makeTranscript(pairs: Array<{ user: string; assistant: string }>): string {
  return pairs.map((p, i) => [
    JSON.stringify({ type: 'user', message: { role: 'user', content: p.user }, timestamp: `ts${i * 2}` }),
    JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: p.assistant }, timestamp: `ts${i * 2 + 1}` }),
  ].join('\n')).join('\n');
}

describe('violation detection (Signal 1)', () => {
  it('returns empty for short sessions', () => {
    const content = makeTranscript([
      { user: 'Build with React', assistant: "Let's use React with TypeScript." },
      { user: 'Add auth', assistant: "I'll add JWT authentication." },
    ]);
    const messages = parseTranscriptContent(content);
    const turns = parseAllTurns(messages);
    const signals = detectViolations(turns);
    expect(signals).toEqual([]);
  });

  it('does NOT flag when user changes their mind', () => {
    // User says "use Tailwind" then later says "don't use Tailwind" — that's an update, not a violation
    const content = makeTranscript([
      { user: "Let's use Tailwind for styling.", assistant: "Sure, I'll use Tailwind CSS." },
      { user: 'Build the header.', assistant: 'Here is the header with Tailwind classes.' },
      { user: 'Build the sidebar.', assistant: 'Here is the sidebar with Tailwind.' },
      { user: "Actually, don't use Tailwind anymore. Switch to plain CSS.", assistant: "Got it, switching to plain CSS." },
      { user: 'Build the footer.', assistant: 'Here is the footer with plain CSS.' },
    ]);
    const messages = parseTranscriptContent(content);
    const turns = parseAllTurns(messages);
    const signals = detectViolations(turns);
    const violations = signals.filter((s) => s.type === 'violation');
    expect(violations).toEqual([]);
  });

  it('flags when AI contradicts active user decision on its own', () => {
    // User says "use Tailwind" and never changes mind, but AI starts saying "don't use Tailwind"
    const content = makeTranscript([
      { user: "Let's use Tailwind for styling.", assistant: "Sure, I'll set up Tailwind CSS." },
      { user: 'Build the card component.', assistant: 'Here is the card with Tailwind.' },
      { user: 'Build the header.', assistant: 'Here is the header with Tailwind utilities.' },
      // AI contradicts on its own — user said nothing about changing
      { user: 'Build the form.', assistant: "Don't use Tailwind for the form. I'll use inline styles instead." },
    ]);
    const messages = parseTranscriptContent(content);
    const turns = parseAllTurns(messages);
    const signals = detectViolations(turns);
    const violations = signals.filter((s) => s.type === 'violation');
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].details).toContain('Tailwind');
  });

  it('user decision update supersedes old decision', () => {
    // User says "use PostgreSQL", then later says "use SQLite for the database"
    // AI follows the new decision — no violation
    const content = makeTranscript([
      { user: "Let's use PostgreSQL for the database.", assistant: "Sure, setting up PostgreSQL." },
      { user: 'Create the schema.', assistant: 'Here is the PostgreSQL schema.' },
      { user: 'Actually, use SQLite for the database.', assistant: "Got it, switching to SQLite." },
      { user: 'Create the queries.', assistant: "Here are the SQLite queries." },
    ]);
    const messages = parseTranscriptContent(content);
    const turns = parseAllTurns(messages);
    const signals = detectViolations(turns);
    const violations = signals.filter((s) => s.type === 'violation');
    expect(violations).toEqual([]);
  });

  it('scores violations correctly', () => {
    expect(scoreViolations([])).toBe(0);

    const signals = [
      { type: 'violation' as const, turn: 10, score: 80, description: 'test' },
      { type: 'violation' as const, turn: 15, score: 70, description: 'test2' },
    ];
    const score = scoreViolations(signals);
    expect(score).toBe(50); // 2 * 25, capped at 100
  });
});
