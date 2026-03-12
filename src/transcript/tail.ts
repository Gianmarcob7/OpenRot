import fs from 'fs';
import type { TranscriptMessage } from '../types.js';

/**
 * Efficiently read the last N lines from a JSONL transcript file.
 * Reads from the end of the file to avoid loading the entire transcript
 * into memory — critical for the Stop hook's <5s performance target.
 */
export function tailTranscript(
  transcriptPath: string,
  maxLines: number = 40,
): TranscriptMessage[] {
  try {
    if (!fs.existsSync(transcriptPath)) return [];

    const stat = fs.statSync(transcriptPath);
    if (stat.size === 0) return [];

    // For small files (<100KB), just read the whole thing
    if (stat.size < 100_000) {
      const content = fs.readFileSync(transcriptPath, 'utf-8');
      return parseLastNLines(content, maxLines);
    }

    // For large files, read from the end in chunks
    const chunkSize = Math.min(stat.size, 512_000); // 512KB chunks
    const fd = fs.openSync(transcriptPath, 'r');
    try {
      const buffer = Buffer.alloc(chunkSize);
      const startPos = Math.max(0, stat.size - chunkSize);
      fs.readSync(fd, buffer, 0, chunkSize, startPos);
      const content = buffer.toString('utf-8');
      return parseLastNLines(content, maxLines);
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return [];
  }
}

function parseLastNLines(content: string, maxLines: number): TranscriptMessage[] {
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  const tail = lines.slice(-maxLines);
  const messages: TranscriptMessage[] = [];

  for (const line of tail) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.type && parsed.message) {
        messages.push(parsed as TranscriptMessage);
      }
    } catch {
      // Skip malformed lines (common at chunk boundaries)
    }
  }

  return messages;
}

/**
 * Find all .jsonl transcript files in a directory (recursive).
 * Claude Code stores transcripts in ~/.claude/projects/<hash>/<session-id>.jsonl
 */
export function findTranscripts(dirPath: string): string[] {
  const results: string[] = [];

  try {
    if (!fs.existsSync(dirPath)) return [];
    const stat = fs.statSync(dirPath);

    if (stat.isFile() && dirPath.endsWith('.jsonl')) {
      return [dirPath];
    }

    if (!stat.isDirectory()) return [];

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = `${dirPath}/${entry.name}`;
      if (entry.isFile() && entry.name.endsWith('.jsonl')) {
        results.push(fullPath);
      } else if (entry.isDirectory()) {
        results.push(...findTranscripts(fullPath));
      }
    }
  } catch {
    // Permission errors, etc.
  }

  return results;
}
