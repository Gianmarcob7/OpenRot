# Contributing to OpenRot

Thank you for your interest in contributing to OpenRot!

## Development Setup

```bash
# Clone the repo
git clone https://github.com/openrot/openrot.git
cd openrot

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format
```

## Architecture

OpenRot runs as an MCP server that editors connect to. The core pipeline:

1. **Extract** — Pull decisions from messages (regex → embedding → LLM)
2. **Store** — Save decisions to SQLite with embeddings
3. **Score** — Check new messages against stored decisions
4. **Warn** — Fire actionable warnings for contradictions

## Project Structure

```
src/
├── index.ts          CLI entry point
├── server.ts         MCP server
├── pipeline.ts       Message processing pipeline
├── logger.ts         Winston file logger
├── types.ts          TypeScript interfaces
├── extract/          Decision extraction (3 tiers)
├── score/            Contradiction scoring
├── models/           LLM provider clients
├── config/           Config loading & detection
├── cli/              CLI commands
└── db/               SQLite database layer
```

## Key Design Principles

1. **Never block the session** — All processing is async. If it takes > 500ms, skip.
2. **Fail silently** — Every operation is wrapped in try/catch. Never crash the user's session.
3. **Zero config** — Must work with `npm install -g openrot && openrot init`.
4. **Local first** — Regex tier provides value with zero API calls.

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npx vitest run tests/extract/regex.test.ts

# Run with coverage
npx vitest run --coverage
```

All tests use in-memory SQLite databases for isolation.

## Building

```bash
# Build the production bundle
npm run build

# Test the built CLI
node dist/index.js --help
```

## Pull Request Guidelines

- Run `npm test` and `npm run typecheck` before submitting
- Add tests for new extraction patterns or scoring logic
- Keep the "fail silently" principle — never add code that could crash the MCP server
- Use the existing type system in `types.ts`
