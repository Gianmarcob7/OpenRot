import type { OpenRotConfig, ModelConfig } from '../types.js';

export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  mode: 'auto',
  model: null,
  apiKey: null,
  baseUrl: null,
};

export const DEFAULT_CONFIG: OpenRotConfig = {
  extraction: { ...DEFAULT_MODEL_CONFIG },
  contradiction: { ...DEFAULT_MODEL_CONFIG },
  threshold: 0.75,
  sensitivity: 'medium',
};

export function mergeConfig(
  userConfig: Partial<OpenRotConfig>,
  defaults: OpenRotConfig = DEFAULT_CONFIG,
): OpenRotConfig {
  return {
    extraction: {
      ...defaults.extraction,
      ...(userConfig.extraction || {}),
    },
    contradiction: {
      ...defaults.contradiction,
      ...(userConfig.contradiction || {}),
    },
    threshold: userConfig.threshold ?? defaults.threshold,
    sensitivity: userConfig.sensitivity ?? defaults.sensitivity,
  };
}
