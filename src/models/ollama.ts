import type { ModelClient } from '../types.js';

const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Ollama local model client.
 */
export class OllamaClient implements ModelClient {
  private baseUrl: string;
  private model: string;

  constructor(model: string = 'qwen2.5-coder:3b', baseUrl: string = OLLAMA_BASE_URL) {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async complete(systemPrompt: string, userMessage: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          stream: false,
          options: {
            temperature: 0.1,
            num_predict: 1024,
          },
        }),
      });

      if (!response.ok) return '';

      const data = (await response.json()) as { message?: { content?: string } };
      return data.message?.content || '';
    } catch {
      return '';
    }
  }
}

/**
 * Check if Ollama is running locally.
 */
export async function isOllamaRunning(baseUrl: string = OLLAMA_BASE_URL): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get available Ollama models.
 */
export async function getOllamaModels(baseUrl: string = OLLAMA_BASE_URL): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return [];

    const data = (await response.json()) as { models?: Array<{ name: string }> };
    return (data.models || []).map((m) => m.name);
  } catch {
    return [];
  }
}
