# OpenRot

> Your AI coding session is rotting. OpenRot tells you before you waste hours.

> Real-time session health scoring. Cross-platform decision tracking.
> One-command fresh starts with zero context lost.

## Install

```
npm install -g openrot
openrot init
```

That's it. OpenRot monitors your sessions automatically via Claude Code hooks.
You'll only hear from it when something matters.

## How it works

1. You code with Claude Code, Cursor, or any AI tool
2. OpenRot silently tracks every decision and scores every response
3. When quality degrades, you see: `🔴 Session health 73% — run 'openrot handoff'`
4. One command generates a perfect fresh start prompt with all context preserved

## Does it cost money?

No. Everything runs locally by default — regex patterns and local embeddings.
Add an API key or Ollama for smarter analysis. Your choice.

## Does my code leave my machine?

Never. OpenRot reads your session files locally. If you configure an API key,
only the specific message being analyzed is sent — never your codebase.

## Commands

```
openrot init              Set up (auto-detects editors, registers hooks)
openrot handoff           Generate fresh start prompt from current session
openrot handoff --for X   Save handoff to editor instruction file
openrot sync              Sync decisions to all editor instruction files
openrot scan [path]       Scan codebase against your decisions
openrot guard --install   Add pre-commit hook to catch violations
openrot recap             Generate session summary/journal entry
openrot status            Show current session health and decisions
openrot model             Switch AI model provider
openrot test              Verify everything works
```

## Works with

- **Claude Code** — via hooks (deepest integration, fully automatic)
- **Cursor** — via instruction file sync + file watching
- **Google Antigravity** — via instruction file sync + file watching
- **VS Code + Copilot** — via instruction file sync + file watching

## The Rot Score (0–100)

Three signals, weighted:

| Signal | Weight | What it measures |
|--------|--------|-----------------|
| **Decision Contradictions** | 40% | Ratio of contradictions to tracked decisions |
| **Self-Repetition** | 30% | Cosine similarity between recent responses |
| **Context Saturation** | 30% | Estimated token usage + hedging + shrinking |

- 🟢 **0–30** — Session healthy
- 🟡 **31–60** — Quality degrading
- 🔴 **61–100** — Output unreliable

## Fresh Start Handoff

When the rot score fires, one command preserves everything:

```
openrot handoff
```

Generates a structured prompt with all decisions, completed work,
in-progress tasks, and unresolved issues. Paste into a fresh session
and pick up exactly where you left off.

```
openrot handoff --for claude    → Saves to CLAUDE.md
openrot handoff --for cursor    → Saves to .cursorrules
openrot handoff --for antigravity → Saves to AGENT.md
```

## Codebase Scanning

Scan your actual source files against stored decisions:

```
openrot scan
```

Detects violations like inline styles when you committed to Tailwind,
SERIAL primary keys when you chose UUIDs, or yarn.lock when you said npm only.

## Pre-Commit Guard

```
openrot guard --install
```

Blocks commits that violate your decisions. Bypass with `git commit --no-verify`.

## Why OpenRot?

No AI coding tool monitors your session quality across tools.
Anthropic won't build something that watches your Cursor sessions.
Cursor won't track decisions you made in Claude Code.
OpenRot is the independent layer that works everywhere.

## License

MIT
