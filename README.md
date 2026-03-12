# OpenRot

**A linter for your AI context window.**

Your AI coding session silently degrades. The AI starts repeating itself, contradicting earlier decisions, and generating increasingly broken code. You don't notice until you've wasted an hour debugging garbage output.

OpenRot tells you the moment quality drops — and gives you one command to fix it.

```
🔴 OpenRot: Session rotted (67%) — quality dropped at turn 31. Run: openrot fix
```

## Install

```bash
npm install -g openrot
openrot init
```

Zero native modules. Works on any machine with Node.js 18+.

## Quick start

**See it work immediately** — point it at your Claude Code transcripts:

```bash
openrot scan ~/.claude/projects/
```

```
┌─────────────────────────────────────────────────┐
│  OpenRot — Session Analysis                     │
│  Session: abc12345 (2h 14m, 47 turns)           │
│  Quality: ██████████░░░░░░░░░░ 38% DEGRADING    │
└─────────────────────────────────────────────────┘

Timeline:
● ● ● ● ● ● ● ● ● ● ● ● ● ● ●│⚠ ● ● ● ● ● ● ● ●
Turn 1                          31                 47
                                └─ rot detected

Signals:
  ⚠️  Turn 31  Instruction violation
           Contradicts "use Tailwind" (established at turn 3)
  ⚠️  Turn 35  Circular pattern
           Re-read db/schema.ts 4 times without changes
  🔴 Turn 42  Repair loop
           Same TypeError fix attempted 3 times

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
16 turns of degraded output (~45 min wasted)
Run: openrot fix --session abc12345
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**One command to start fresh** with all context preserved:

```bash
openrot fix
```

```
✅ Handoff prompt copied to clipboard
   Paste into a new session to continue with full context.
```

## How it works

OpenRot detects five signals of context degradation:

| Signal | What it detects | Weight |
|--------|----------------|--------|
| **Instruction violations** | AI contradicts decisions it followed earlier | 25% |
| **Circular patterns** | AI re-reads the same files repeatedly without progress | 25% |
| **Repair loops** | AI attempts the same fix multiple times | 25% |
| **Quality decline** | Responses get shorter, vaguer, more hedging | 15% |
| **Context saturation** | Approaching the point where models degrade | 10% |

These signals are combined into a single score:

- **0–20: HEALTHY** — complete silence, no output
- **21–45: DEGRADING** — one-line warning to stderr
- **46+: ROTTED** — warning + fix suggestion

## Three ways to use it

### Automatic (Claude Code)

Hooks fire after every AI response. Zero effort.

```bash
openrot init  # auto-registers hooks
```

### AI-aware (Cursor, VS Code, Antigravity)

OpenRot runs as an MCP server. The AI calls it when it feels stuck.

```bash
openrot serve  # start MCP server
```

### Manual

Point it at any transcript file or directory:

```bash
openrot scan <path-to-session.jsonl>
openrot scan ~/.claude/projects/
```

## Commands

```
openrot scan [path]       Analyze session transcript(s) for degradation
openrot fix               Generate fresh start prompt with full context
openrot init              Set up (auto-detects editors, registers hooks)
openrot status            Show current session health
openrot serve             Start MCP server (Cursor/VS Code/Antigravity)
openrot config            Change settings
openrot model             Switch model provider
openrot test              Verify everything works
```

## The fix command

`openrot fix` generates a handoff prompt that:

1. Identifies the **rot point** — the exact turn where quality started degrading
2. Extracts all decisions and progress from **before** the rot point
3. Marks work done **after** the rot point as needing re-verification
4. Lists patterns to **avoid** (things that caused problems)

```
Continuing a previous session on my-project.
The prior session degraded after turn 31.
Below is the verified context from before degradation.

DECISIONS MADE:
- use React + TypeScript with Vite
- use Tailwind CSS only — no inline styles
- use PostgreSQL with UUID primary keys
- use Express backend with Prisma ORM

COMPLETED (verified before degradation):
- Project scaffolding (client/ + server/)
- Database schema with all tables
- Auth endpoints (register, login, logout)

IN PROGRESS (may need re-verification):
- Recipe card component (started but rot detected during this work)

AVOID (these caused issues in the prior session):
- Do not use inline styles — this violated the Tailwind decision
- Do not re-read schema.ts repeatedly — the schema is stable

Continue from the recipe card component.
```

## Does it cost money?

No. Everything runs locally. No API keys required for core functionality.

## Does my code leave my machine?

Never. OpenRot reads session files locally and never sends data anywhere.

## Why this exists

Research shows AI coding sessions degrade silently:

- **EMNLP 2025**: LLM performance degrades as input length increases, even with perfect retrieval
- **Stanford "Lost in the Middle"**: 30–47% performance drops for mid-context information
- **LoCoBench-Agent**: Best LLMs achieve barely 37% memory retention in extended sessions
- **Developer surveys**: Only 29% trust AI code accuracy (down from 40%)

OpenRot catches this degradation before you waste hours on bad output.
