# OpenRot + Claude Code

## Setup

### 1. Install OpenRot

```bash
npm install -g openrot
openrot init
```

The init wizard will auto-detect Claude Code and output the config snippet.

### 2. Add MCP config

Add the following to your `~/.claude/claude.json` file under the `"mcpServers"` key:

```json
{
  "mcpServers": {
    "openrot": {
      "command": "openrot",
      "args": ["serve"]
    }
  }
}
```

If the file doesn't exist yet or doesn't have an `mcpServers` section, create it:

```json
{
  "mcpServers": {
    "openrot": {
      "command": "openrot",
      "args": ["serve"]
    }
  }
}
```

### 3. Restart Claude Code

After adding the config, restart Claude Code for the changes to take effect.

### 4. Verify

Start a new conversation and Claude Code will have access to OpenRot's tools:
- `openrot_new_session` — starts tracking
- `openrot_check` — checks for contradictions
- `openrot_status` — shows tracked decisions
- `openrot_dismiss` — dismisses a warning

You can also run:

```bash
openrot test
```

This will verify that the MCP server starts correctly.

## How it works with Claude Code

Claude Code has native MCP support. When OpenRot is configured:

1. At the start of a conversation, Claude Code calls `openrot_new_session`
2. After each AI response, it calls `openrot_check` with the response content
3. If a contradiction is detected, the warning appears in the chat
4. You can dismiss false positives with `openrot_dismiss`

## Troubleshooting

**OpenRot not showing up:**
- Check that `~/.claude/claude.json` is valid JSON
- Make sure `openrot` is in your PATH (run `which openrot` or `where openrot`)
- Check the log file at `~/.openrot/openrot.log`

**No warnings firing:**
- Decision extraction only catches explicit patterns like "let's use X" or "always do Y"
- Try running `openrot status` to see what decisions are being tracked
- Lower the sensitivity: run `openrot config` and set sensitivity to "high"
