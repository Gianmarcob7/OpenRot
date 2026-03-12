import type { DetectionSignal, ParsedTurn } from '../types.js';

/**
 * Signal 2: Circular Tool Calls (weight: 25%)
 *
 * Detects when the AI reads the same files repeatedly without making
 * meaningful changes between reads, or edits the same file over and over.
 * Pattern: read A → edit A → read A → edit A → read A (stuck loop)
 */
export function detectCircular(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];
  const assistantTurns = turns.filter((t) => t.type === 'assistant');

  // Track file reads and edits across turns
  const fileReads: Map<string, number[]> = new Map();
  const fileEdits: Map<string, number[]> = new Map();

  for (const turn of assistantTurns) {
    for (const tool of turn.toolCalls) {
      if (!tool.filePath) continue;
      const path = normalizePath(tool.filePath);

      if (isReadTool(tool.toolName)) {
        const reads = fileReads.get(path) || [];
        reads.push(turn.index);
        fileReads.set(path, reads);
      }

      if (isEditTool(tool.toolName)) {
        const edits = fileEdits.get(path) || [];
        edits.push(turn.index);
        fileEdits.set(path, edits);
      }
    }
  }

  // Flag files read 3+ times without edits between reads
  for (const [path, reads] of fileReads) {
    const edits = fileEdits.get(path) || [];

    if (reads.length >= 3) {
      // Check if there are meaningful edits between reads
      const readsWithoutEdits = countReadsWithoutEdits(reads, edits);
      if (readsWithoutEdits >= 3) {
        const shortPath = path.split('/').slice(-2).join('/');
        signals.push({
          type: 'circular',
          turn: reads[reads.length - 1],
          score: 75,
          description: 'Circular pattern',
          details: `Re-read ${shortPath} ${reads.length} times without changes`,
        });
      }
    }
  }

  // Flag files edited 3+ times (edit-undo-edit cycles)
  for (const [path, edits] of fileEdits) {
    if (edits.length >= 3) {
      // Check if edits are close together (within 5 turns)
      const clustered = findClusteredEdits(edits, 5);
      if (clustered >= 3) {
        const shortPath = path.split('/').slice(-2).join('/');
        signals.push({
          type: 'circular',
          turn: edits[edits.length - 1],
          score: 80,
          description: 'Edit-undo-edit cycle',
          details: `Edited ${shortPath} ${edits.length} times in quick succession`,
        });
      }
    }
  }

  // Detect repeated patterns from text content (fallback when tool calls aren't parsed)
  const textSignals = detectCircularFromText(assistantTurns);
  signals.push(...textSignals);

  return deduplicateSignals(signals);
}

function isReadTool(name: string): boolean {
  const readTools = ['read', 'read_file', 'readfile', 'cat', 'view', 'Read'];
  return readTools.some((t) => name.toLowerCase().includes(t.toLowerCase()));
}

function isEditTool(name: string): boolean {
  const editTools = ['write', 'edit', 'create', 'replace', 'patch', 'Write', 'Edit', 'str_replace'];
  return editTools.some((t) => name.toLowerCase().includes(t.toLowerCase()));
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

function countReadsWithoutEdits(reads: number[], edits: number[]): number {
  let count = 0;
  for (let i = 1; i < reads.length; i++) {
    const hasEditBetween = edits.some((e) => e > reads[i - 1] && e < reads[i]);
    if (!hasEditBetween) count++;
  }
  return count + 1; // Include first read
}

function findClusteredEdits(edits: number[], windowSize: number): number {
  let maxCluster = 1;
  for (let i = 0; i < edits.length; i++) {
    let count = 1;
    for (let j = i + 1; j < edits.length; j++) {
      if (edits[j] - edits[i] <= windowSize) count++;
      else break;
    }
    maxCluster = Math.max(maxCluster, count);
  }
  return maxCluster;
}

/**
 * Fallback: detect circular patterns from the text of assistant responses
 * when structured tool call data isn't available.
 */
function detectCircularFromText(turns: ParsedTurn[]): DetectionSignal[] {
  const signals: DetectionSignal[] = [];

  // Track file path mentions across consecutive turns
  const pathPattern = /(?:reading|read|opening|looking at|checking)\s+[`"']?([^\s`"']+\.\w{1,5})[`"']?/gi;
  const mentionedFiles: Map<string, number[]> = new Map();

  for (const turn of turns) {
    pathPattern.lastIndex = 0;
    let match;
    while ((match = pathPattern.exec(turn.text)) !== null) {
      const file = match[1];
      const mentions = mentionedFiles.get(file) || [];
      mentions.push(turn.index);
      mentionedFiles.set(file, mentions);
    }
  }

  for (const [file, mentions] of mentionedFiles) {
    if (mentions.length >= 4) {
      signals.push({
        type: 'circular',
        turn: mentions[mentions.length - 1],
        score: 60,
        description: 'Circular pattern',
        details: `Referenced ${file} ${mentions.length} times across turns`,
      });
    }
  }

  return signals;
}

function deduplicateSignals(signals: DetectionSignal[]): DetectionSignal[] {
  const seen = new Set<string>();
  return signals.filter((s) => {
    const key = `${s.turn}:${s.details}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Compute the circular score (0-100) from detected signals.
 */
export function scoreCircular(signals: DetectionSignal[]): number {
  const circularSignals = signals.filter((s) => s.type === 'circular');
  if (circularSignals.length === 0) return 0;
  return Math.min(100, circularSignals.reduce((sum, s) => sum + s.score, 0) / circularSignals.length + circularSignals.length * 10);
}
