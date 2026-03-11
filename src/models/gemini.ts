import type { ModelClient } from '../types.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Google Gemini model client.
 */
export class GeminiClient implements ModelClient {
  private model: any;

  constructor(apiKey: string, model: string = 'gemini-2.0-flash') {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model });
  }

  async complete(systemPrompt: string, userMessage: string): Promise<string> {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        },
      });

      const response = await result.response;
      return response.text() || '';
    } catch {
      return '';
    }
  }
}
