import { describe, it, expect } from 'vitest';
import { isEmbeddingAvailable } from '../../src/extract/embedding.js';

describe('embedding extraction', () => {
  it('reports embedding availability without crashing', async () => {
    // This test just verifies the lazy-loading mechanism doesn't throw
    // In CI/test environment, the model may not be available
    const available = await isEmbeddingAvailable();
    expect(typeof available).toBe('boolean');
  });
});
