import { describe, it, expect, afterEach } from 'vitest';
import { tailTranscript, findTranscripts } from '../../src/transcript/tail.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

const TEMP_DIR = path.join(os.tmpdir(), 'openrot-test-tail');

function createTempFile(name: string, content: string): string {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
  const filePath = path.join(TEMP_DIR, name);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

function cleanup(): void {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

afterEach(cleanup);

describe('tailTranscript', () => {
  it('returns empty for non-existent file', () => {
    expect(tailTranscript('/nonexistent/file.jsonl')).toEqual([]);
  });

  it('returns empty for empty file', () => {
    const file = createTempFile('empty.jsonl', '');
    expect(tailTranscript(file)).toEqual([]);
  });

  it('parses small JSONL file', () => {
    const content = [
      '{"type":"user","message":{"role":"user","content":"Hello"},"timestamp":"ts1"}',
      '{"type":"assistant","message":{"role":"assistant","content":"Hi there!"},"timestamp":"ts2"}',
    ].join('\n');
    const file = createTempFile('small.jsonl', content);
    const messages = tailTranscript(file);
    expect(messages).toHaveLength(2);
    expect(messages[0].type).toBe('user');
    expect(messages[1].type).toBe('assistant');
  });

  it('returns only last N lines', () => {
    const lines = Array.from({ length: 100 }, (_, i) =>
      JSON.stringify({
        type: i % 2 === 0 ? 'user' : 'assistant',
        message: { role: i % 2 === 0 ? 'user' : 'assistant', content: `msg ${i}` },
        timestamp: `ts${i}`,
      }),
    );
    const file = createTempFile('large.jsonl', lines.join('\n'));
    const messages = tailTranscript(file, 10);
    expect(messages.length).toBeLessThanOrEqual(10);
  });
});

describe('findTranscripts', () => {
  it('returns empty for non-existent directory', () => {
    expect(findTranscripts('/nonexistent/dir')).toEqual([]);
  });

  it('finds .jsonl files recursively', () => {
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
    const subDir = path.join(TEMP_DIR, 'sub');
    fs.mkdirSync(subDir, { recursive: true });

    createTempFile('a.jsonl', '{}');
    fs.writeFileSync(path.join(subDir, 'b.jsonl'), '{}', 'utf-8');
    fs.writeFileSync(path.join(TEMP_DIR, 'c.txt'), 'not jsonl', 'utf-8');

    const found = findTranscripts(TEMP_DIR);
    expect(found.length).toBe(2);
    expect(found.every((f) => f.endsWith('.jsonl'))).toBe(true);
  });

  it('returns single file if path is a .jsonl file', () => {
    const file = createTempFile('single.jsonl', '{}');
    const found = findTranscripts(file);
    expect(found).toEqual([file]);
  });
});
