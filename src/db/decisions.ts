import type { Database } from 'sql.js';
import type { Decision, DecisionRow, ExtractionResult } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

export class DecisionStore {
  private db: Database;
  private save: () => void;

  constructor(db: Database, save: () => void = () => {}) {
    this.db = db;
    this.save = save;
  }

  create(sessionId: string, turn: number, extraction: ExtractionResult): Decision {
    const decision: Decision = {
      id: uuidv4(),
      sessionId,
      turn,
      rawText: extraction.rawText,
      commitment: extraction.commitment,
      type: extraction.type,
      confidence: extraction.confidence,
      embedding: null,
      source: extraction.source,
      createdAt: Date.now(),
    };

    this.db.run(
      `INSERT INTO decisions (id, session_id, turn, raw_text, commitment, type, confidence, embedding, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        decision.id,
        decision.sessionId,
        decision.turn,
        decision.rawText,
        decision.commitment,
        decision.type,
        decision.confidence,
        null,
        decision.source,
        decision.createdAt,
      ],
    );
    this.save();

    return decision;
  }

  updateEmbedding(id: string, embedding: Float32Array): void {
    const buffer = new Uint8Array(embedding.buffer, embedding.byteOffset, embedding.byteLength);
    this.db.run('UPDATE decisions SET embedding = ? WHERE id = ?', [buffer, id]);
    this.save();
  }

  getById(id: string): Decision | null {
    const results = this.db.exec('SELECT * FROM decisions WHERE id = ?', [id]);
    if (!results.length || !results[0].values.length) return null;
    return this.rowToDecision(this.mapRow(results[0].columns, results[0].values[0]));
  }

  getBySessionId(sessionId: string): Decision[] {
    const results = this.db.exec(
      'SELECT * FROM decisions WHERE session_id = ? ORDER BY turn ASC, created_at ASC',
      [sessionId],
    );
    if (!results.length) return [];
    return results[0].values.map((row) =>
      this.rowToDecision(this.mapRow(results[0].columns, row)),
    );
  }

  getWithEmbeddings(sessionId: string): Decision[] {
    const results = this.db.exec(
      'SELECT * FROM decisions WHERE session_id = ? AND embedding IS NOT NULL ORDER BY turn ASC',
      [sessionId],
    );
    if (!results.length) return [];
    return results[0].values.map((row) =>
      this.rowToDecision(this.mapRow(results[0].columns, row)),
    );
  }

  deleteBySessionId(sessionId: string): void {
    this.db.run('DELETE FROM decisions WHERE session_id = ?', [sessionId]);
    this.save();
  }

  /** Check if a very similar commitment already exists for this session */
  isDuplicate(sessionId: string, commitment: string): boolean {
    const normalized = commitment.toLowerCase().trim();
    const existing = this.getBySessionId(sessionId);
    return existing.some((d) => d.commitment.toLowerCase().trim() === normalized);
  }

  /** Get all decisions for a specific project path (across all sessions) */
  getAllForProject(projectPath: string): Decision[] {
    const results = this.db.exec(
      'SELECT * FROM decisions WHERE project_path = ? ORDER BY created_at DESC',
      [projectPath],
    );
    if (!results.length) {
      // Fall back to all decisions if no project-specific ones exist
      return this.getAll();
    }
    return results[0].values.map((row) =>
      this.rowToDecision(this.mapRow(results[0].columns, row)),
    );
  }

  /** Get all decisions across all sessions */
  getAll(): Decision[] {
    const results = this.db.exec(
      'SELECT * FROM decisions ORDER BY created_at DESC',
    );
    if (!results.length) return [];
    return results[0].values.map((row) =>
      this.rowToDecision(this.mapRow(results[0].columns, row)),
    );
  }

  private mapRow(columns: string[], values: unknown[]): DecisionRow {
    const row: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row as unknown as DecisionRow;
  }

  private rowToDecision(row: DecisionRow): Decision {
    let embedding: Float32Array | null = null;
    if (row.embedding) {
      const buffer = row.embedding instanceof Uint8Array
        ? row.embedding
        : new Uint8Array(row.embedding as ArrayBuffer);
      embedding = new Float32Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength / Float32Array.BYTES_PER_ELEMENT,
      );
    }

    return {
      id: row.id,
      sessionId: row.session_id,
      turn: row.turn,
      rawText: row.raw_text,
      commitment: row.commitment,
      type: row.type as Decision['type'],
      confidence: row.confidence,
      embedding,
      source: row.source as Decision['source'],
      createdAt: row.created_at,
    };
  }
}
