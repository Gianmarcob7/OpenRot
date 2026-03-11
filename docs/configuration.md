# Configuration

OpenRot stores its configuration at `~/.openrot/config.json`. You can edit this file directly, use `openrot config` for general settings, or use `openrot model` to switch model providers interactively.

## Switching Models

The fastest way to change your model is:

```bash
openrot model
```

This launches an interactive picker showing your current provider/model, lets you choose a new provider, and saves immediately.

### Non-interactive usage

```bash
# Switch to Ollama
openrot model --provider ollama --model qwen2.5-coder:3b

# Switch to OpenAI
openrot model --provider openai --model gpt-4o-mini --key sk-...

# Switch to regex only (no LLM)
openrot model --provider regex
```

## Config File Location

| Platform | Path |
|----------|------|
| macOS/Linux | `~/.openrot/config.json` |
| Windows | `%USERPROFILE%\.openrot\config.json` |

OpenRot also supports cosmiconfig, so you can place config in:
- `.openrotrc`
- `.openrotrc.json`
- `.openrotrc.yaml`
- `openrot.config.js`
- `package.json` under the `"openrot"` key

## Full Configuration Reference

```json
{
  "extraction": {
    "mode": "auto",
    "model": null,
    "apiKey": null,
    "baseUrl": null
  },
  "contradiction": {
    "mode": "auto",
    "model": null,
    "apiKey": null,
    "baseUrl": null
  },
  "threshold": 0.75,
  "sensitivity": "medium"
}
```

### `extraction` / `contradiction`

Both sections have the same structure. `extraction` controls how decisions are pulled from messages. `contradiction` controls how contradictions are judged.

#### `mode`

| Value | Description |
|-------|-------------|
| `"auto"` | **(default)** Auto-detect the best available provider. Priority: OpenAI → Anthropic → Gemini → Ollama → regex only. |
| `"regex"` | Regex heuristics only. Zero cost, no API calls. Still genuinely useful. |
| `"openai"` | Use OpenAI API. Reads `OPENAI_API_KEY` from environment if `apiKey` is null. |
| `"anthropic"` | Use Anthropic API. Reads `ANTHROPIC_API_KEY` from environment. |
| `"gemini"` | Use Google Gemini API. Reads `GEMINI_API_KEY` from environment. |
| `"ollama"` | Use Ollama local models. No API key needed. |
| `"custom"` | Use any OpenAI-compatible endpoint. Requires `baseUrl`. |

#### `model`

The model name to use. When `null`, OpenRot uses the cheapest recommended default:

| Provider | Default Model |
|----------|--------------|
| OpenAI | `gpt-4o-mini` |
| Anthropic | `claude-haiku-4-5-20251001` |
| Gemini | `gemini-2.0-flash` |
| Ollama | `qwen2.5-coder:3b` |

#### `apiKey`

API key for the provider. When `null`, reads from the corresponding environment variable:

| Provider | Environment Variable |
|----------|---------------------|
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Gemini | `GEMINI_API_KEY` |
| Ollama | *(none needed)* |

#### `baseUrl`

Custom API base URL. Only needed for:
- **Custom mode**: Point to any OpenAI-compatible endpoint
- **Ollama**: Override the default `http://localhost:11434`

Examples:
```json
{
  "extraction": {
    "mode": "custom",
    "baseUrl": "https://api.groq.com/openai/v1",
    "apiKey": "gsk_...",
    "model": "llama-3.1-8b-instant"
  }
}
```

### `threshold`

Confidence threshold for firing warnings. Range: `0.0` to `1.0`. Default: `0.75`.

- Below threshold: logged silently, not shown to user
- Above threshold: warning fires in the editor

### `sensitivity`

| Value | Threshold | Description |
|-------|-----------|-------------|
| `"low"` | 0.85 | Fewer warnings, very high confidence required |
| `"medium"` | 0.75 | **(default)** Balanced |
| `"high"` | 0.60 | More warnings, catches more potential contradictions |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `GEMINI_API_KEY` | Google Gemini API key |

## Data Storage

| Path | Description |
|------|-------------|
| `~/.openrot/config.json` | Configuration file |
| `~/.openrot/sessions.db` | SQLite database (sessions, decisions, warnings) |
| `~/.openrot/openrot.log` | Application log file |
