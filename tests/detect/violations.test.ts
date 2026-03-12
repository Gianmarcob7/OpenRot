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

  it('detects use vs avoid contradiction', () => {
    // Need enough turns with extractable decisions in both halves
    const content = makeTranscript([
      { user: 'Style approach?', assistant: "Let's use Tailwind for styling." },
      { user: 'DB?', assistant: "Let's use PostgreSQL for the database." },
      { user: 'Add a card', assistant: "We're using Tailwind classes for all components." },
      { user: 'Buttons', assistant: "Always use Tailwind utilities for styling." },
      // --- midpoint ---
      { user: 'Fix the layout', assistant: "Don't use Tailwind for this section." },
      { user: 'Sidebar', assistant: "Never use Tailwind going forward." },
      { user: 'Footer', assistant: "Don't use PostgreSQL. Let's use SQLite for the database." },
      { user: 'Final', assistant: "Never use Tailwind in this project." },
    ]);
    const messages = parseTranscriptContent(content);
    const turns = parseAllTurns(messages);
    const signals = detectViolations(turns);
    expect(signals.length).toBeGreaterThan(0);
    expect(signals[0].type).toBe('violation');
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
