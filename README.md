# OpenRot

> Catches when AI contradicts decisions you've already made.
> Works silently inside Claude Code, Cursor, and VS Code.

\[PLACEHOLDER: animated GIF of warning firing mid-session\]

## Install

```bash
npm install -g openrot
openrot init
```

That's it. OpenRot runs silently in the background and only speaks when it catches something worth catching.

## How it works

1. You make a decision: *"let's use Tailwind for all styling"*
2. OpenRot stores it
3. Later, AI generates inline CSS
4. OpenRot fires a warning with the exact turn where you decided

## Does it cost money?

No. By default, OpenRot uses pattern matching — no API calls, no cost.
If you add an API key, it gets smarter. If you have Ollama, it's free
and smarter. Your choice.

## Does my code leave my machine?

No. Everything runs locally by default. If you configure an API key,
only the specific message being checked is sent — never your codebase.

## Commands

| Command | Description |
|---------|-------------|
| `openrot init` | Set up (auto-detects your editor) |
| `openrot model` | Switch model provider and model |
| `openrot status` | See what's been tracked |
| `openrot config` | Change settings |
| `openrot test` | Verify everything works |
| `openrot inject` | Inject/remove editor instructions |
| `openrot reset` | Clear session data |
| `openrot serve` | Start the MCP server |

## /dg commands (use inside your editor chat)

| Command | Description |
|---------|-------------|
| `/dg status` | See tracked decisions |
| `/dg off` | Pause for this session |
| `/dg why` | Explain the last warning |
| `/dg dismiss` | Dismiss the last warning |

## How it scores contradictions

OpenRot uses a tiered approach:

- **Tier 0: Regex** — Always active, zero cost. Catches explicit contradictions like "use Tailwind" → inline CSS.
- **Tier 1: Embeddings** — Local ML model (no API call). Finds semantically similar decisions.
- **Tier 2: LLM** — Uses your API key or Ollama for ambiguous cases.

## Supported editors

- **Claude Code** — Native MCP support, deepest integration
- **Cursor** — MCP support via settings
- **VS Code + Copilot** — MCP support
- **Any MCP-compatible editor** — Works automatically

## Configuration

See [docs/configuration.md](./docs/configuration.md) for full configuration reference.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

MIT
