import type { ModelClient } from '../types.js';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Anthropic model client.
 */
export class AnthropicClient implements ModelClient {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-haiku-4-5-20251001') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async complete(systemPrompt: string, userMessage: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const block = response.content[0];
      if (block.type === 'text') {
        return block.text;
      }
      return '';
    } catch {
      return '';
    }
  }
}
