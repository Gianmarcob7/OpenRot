import type Database from 'better-sqlite3';
import type { Decision, DecisionRow, ExtractionResult } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

export class DecisionStore {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
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

    this.db
      .prepare(
        `INSERT INTO decisions (id, session_id, turn, raw_text, commitment, type, confidence, embedding, source, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
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
      );

    return decision;
  }

  updateEmbedding(id: string, embedding: Float32Array): void {
    const buffer = Buffer.from(embedding.buffer);
    this.db.prepare('UPDATE decisions SET embedding = ? WHERE id = ?').run(buffer, id);
  }

  getById(id: string): Decision | null {
    const row = this.db.prepare('SELECT * FROM decisions WHERE id = ?').get(id) as
      | DecisionRow
      | undefined;

    if (!row) return null;
    return this.rowToDecision(row);
  }

  getBySessionId(sessionId: string): Decision[] {
    const rows = this.db
      .prepare('SELECT * FROM decisions WHERE session_id = ? ORDER BY turn ASC, created_at ASC')
      .all(sessionId) as DecisionRow[];

    return rows.map((row) => this.rowToDecision(row));
  }

  getWithEmbeddings(sessionId: string): Decision[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM decisions WHERE session_id = ? AND embedding IS NOT NULL ORDER BY turn ASC',
      )
      .all(sessionId) as DecisionRow[];

    return rows.map((row) => this.rowToDecision(row));
  }

  deleteBySessionId(sessionId: string): void {
    this.db.prepare('DELETE FROM decisions WHERE session_id = ?').run(sessionId);
  }

  /** Check if a very similar commitment already exists for this session */
  isDuplicate(sessionId: string, commitment: string): boolean {
    const normalized = commitment.toLowerCase().trim();
    const existing = this.getBySessionId(sessionId);
    return existing.some((d) => d.commitment.toLowerCase().trim() === normalized);
  }

  private rowToDecision(row: DecisionRow): Decision {
    let embedding: Float32Array | null = null;
    if (row.embedding) {
      const buffer = row.embedding;
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
