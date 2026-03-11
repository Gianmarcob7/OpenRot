import type { ModelClient } from '../types.js';
import OpenAI from 'openai';

/**
 * OpenAI model client. Also works with any OpenAI-compatible endpoint
 * (Groq, Together, LM Studio, etc.) via baseUrl.
 */
export class OpenAIClient implements ModelClient {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini', baseUrl?: string) {
    this.client = new OpenAI({
      apiKey,
      ...(baseUrl ? { baseURL: baseUrl } : {}),
    });
    this.model = model;
  }

  async complete(systemPrompt: string, userMessage: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.1,
        max_tokens: 1024,
      });

      return response.choices[0]?.message?.content || '';
    } catch {
      return '';
    }
  }
}
