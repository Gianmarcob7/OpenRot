// ═══════════════════════════════════════════════════════════
// OpenRot — Type Definitions
// ═══════════════════════════════════════════════════════════

// ── Decision Types ──────────────────────────────────────────

export type DecisionType = 'use' | 'avoid' | 'always' | 'never' | 'architectural';
export type ExtractionSource = 'regex' | 'embedding' | 'llm';
export type SensitivityLevel = 'low' | 'medium' | 'high';
export type ModelMode = 'auto' | 'regex' | 'ollama' | 'openai' | 'anthropic' | 'gemini' | 'custom';

export interface Decision {
  id: string;
  sessionId: string;
  turn: number;
  rawText: string;
  commitment: string;
  type: DecisionType;
  confidence: number;
  embedding: Float32Array | null;
  source: ExtractionSource;
  createdAt: number;
}

export interface DecisionRow {
  id: string;
  session_id: string;
  turn: number;
  raw_text: string;
  commitment: string;
  type: string;
  confidence: number;
  embedding: Buffer | null;
  source: string;
  created_at: number;
}

// ── Warning Types ───────────────────────────────────────────

export interface Warning {
  id: string;
  sessionId: string;
  currentTurn: number;
  priorDecisionId: string;
  confidence: number;
  reason: string;
  dismissed: boolean;
  createdAt: number;
}

export interface WarningRow {
  id: string;
  session_id: string;
  current_turn: number;
  prior_decision_id: string;
  confidence: number;
  reason: string;
  dismissed: number;
  created_at: number;
}

export interface WarningOutput {
  warningId: string;
  sessionId: string;
  currentTurn: number;
  priorTurn: number;
  priorDecision: string;
  newResponse: string;
  confidence: number;
  reason: string;
  suggestedAction: string;
}

// ── Session Types ───────────────────────────────────────────

export interface Session {
  id: string;
  createdAt: number;
  editor: string | null;
  endedAt: number | null;
}

export interface SessionRow {
  id: string;
  created_at: number;
  editor: string | null;
  ended_at: number | null;
}

// ── Extraction Types ────────────────────────────────────────

export interface ExtractionResult {
  commitment: string;
  type: DecisionType;
  confidence: number;
  rawText: string;
  source: ExtractionSource;
}

export interface LLMExtractionItem {
  commitment: string;
  type: DecisionType;
  confidence: number;
}

// ── Scoring Types ───────────────────────────────────────────

export interface ContradictionResult {
  isContradiction: boolean;
  confidence: number;
  reason: string;
  priorDecision: Decision;
  relevantExcerpt: string;
}

export interface SimilarityMatch {
  decision: Decision;
  similarity: number;
}

export interface JudgeResult {
  contradicts: boolean;
  confidence: number;
  reason: string;
}

// ── Config Types ────────────────────────────────────────────

export interface ModelConfig {
  mode: ModelMode;
  model: string | null;
  apiKey: string | null;
  baseUrl: string | null;
}

export interface OpenRotConfig {
  extraction: ModelConfig;
  contradiction: ModelConfig;
  threshold: number;
  sensitivity: SensitivityLevel;
}

// ── MCP Tool Types ──────────────────────────────────────────

export interface CheckInput {
  message: string;
  turn: number;
  sessionId: string;
}

export interface CheckOutput {
  hasWarning: boolean;
  warning?: {
    warningId: string;
    priorTurn: number;
    priorDecision: string;
    contradiction: string;
    confidence: number;
    reason: string;
  };
  decisionsExtracted: number;
}

export interface StatusInput {
  sessionId: string;
}

export interface StatusOutput {
  decisions: Decision[];
  warningCount: number;
  sessionAge: number;
}

export interface DismissInput {
  warningId: string;
  reason?: string;
}

export interface DismissOutput {
  success: boolean;
}

export interface NewSessionInput {
  editor?: string;
}

export interface NewSessionOutput {
  sessionId: string;
}

// ── Model Client Interface ──────────────────────────────────

export interface ModelClient {
  complete(systemPrompt: string, userMessage: string): Promise<string>;
}

// ── Environment Detection ───────────────────────────────────

export interface DetectedEnvironment {
  editors: {
    claudeCode: boolean;
    cursor: boolean;
    vscode: boolean;
    antigravity: boolean;
  };
  models: {
    ollama: boolean;
    openai: boolean;
    anthropic: boolean;
    gemini: boolean;
  };
  ollamaModels: string[];
}

// ── Pipeline Types ──────────────────────────────────────────

export interface PipelineResult {
  decisionsExtracted: ExtractionResult[];
  contradictions: ContradictionResult[];
}

// ── Logger ──────────────────────────────────────────────────

export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}
