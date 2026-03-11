import type { ModelClient, ModelConfig } from '../types.js';
import { OpenAIClient } from './openai.js';
import { AnthropicClient } from './anthropic.js';
import { GeminiClient } from './gemini.js';
import { OllamaClient, isOllamaRunning } from './ollama.js';

interface ModelSelection {
  client: ModelClient;
  provider: string;
  model: string;
}

/**
 * Create a model client from explicit config.
 */
export function createModelClient(config: ModelConfig): ModelClient | null {
  try {
    switch (config.mode) {
      case 'openai': {
        const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
        if (!apiKey) return null;
        return new OpenAIClient(apiKey, config.model || 'gpt-4o-mini', config.baseUrl || undefined);
      }
      case 'anthropic': {
        const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return null;
        return new AnthropicClient(apiKey, config.model || 'claude-haiku-4-5-20251001');
      }
      case 'gemini': {
        const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) return null;
        return new GeminiClient(apiKey, config.model || 'gemini-2.0-flash');
      }
      case 'ollama': {
        return new OllamaClient(
          config.model || 'qwen2.5-coder:3b',
          config.baseUrl || 'http://localhost:11434',
        );
      }
      case 'custom': {
        // Custom mode uses OpenAI-compatible endpoint
        const apiKey = config.apiKey || '';
        if (!config.baseUrl) return null;
        return new OpenAIClient(apiKey, config.model || 'default', config.baseUrl);
      }
      case 'regex':
        return null; // No model needed for regex-only mode
      case 'auto':
        return null; // Should use getModelClient() instead
      default:
        return null;
    }
  } catch {
    return null;
  }
}

/**
 * Auto-detect and return the best available model client.
 * Priority order:
 * 1. OPENAI_API_KEY → gpt-4o-mini
 * 2. ANTHROPIC_API_KEY → claude-haiku-4-5-20251001
 * 3. GEMINI_API_KEY → gemini-2.0-flash
 * 4. Ollama running → qwen2.5-coder:3b
 * 5. null (regex only)
 *
 * Never throws — returns null on any failure.
 */
export async function getModelClient(): Promise<ModelSelection | null> {
  try {
    // 1. Check OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      return {
        client: new OpenAIClient(openaiKey, 'gpt-4o-mini'),
        provider: 'openai',
        model: 'gpt-4o-mini',
      };
    }

    // 2. Check Anthropic
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      return {
        client: new AnthropicClient(anthropicKey, 'claude-haiku-4-5-20251001'),
        provider: 'anthropic',
        model: 'claude-haiku-4-5-20251001',
      };
    }

    // 3. Check Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      return {
        client: new GeminiClient(geminiKey, 'gemini-2.0-flash'),
        provider: 'gemini',
        model: 'gemini-2.0-flash',
      };
    }

    // 4. Check Ollama
    const ollamaRunning = await isOllamaRunning();
    if (ollamaRunning) {
      return {
        client: new OllamaClient('qwen2.5-coder:3b'),
        provider: 'ollama',
        model: 'qwen2.5-coder:3b',
      };
    }

    // 5. No provider found
    return null;
  } catch {
    return null;
  }
}

/**
 * Get a human-readable name for the current model provider.
 */
export function getModelName(selection: ModelSelection | null): string | null {
  if (!selection) return null;
  return `${selection.provider}/${selection.model}`;
}

export { OpenAIClient } from './openai.js';
export { AnthropicClient } from './anthropic.js';
export { GeminiClient } from './gemini.js';
export { OllamaClient, isOllamaRunning, getOllamaModels } from './ollama.js';
