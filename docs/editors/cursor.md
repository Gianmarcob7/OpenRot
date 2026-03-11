# OpenRot + Cursor

## Setup

### 1. Install OpenRot

```bash
npm install -g openrot
openrot init
```

The init wizard will auto-detect Cursor and output the config snippet.

### 2. Add MCP config

Add the following to your `~/.cursor/mcp.json` file under the `"mcpServers"` key:

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

If the file doesn't exist, create it with the full content above.

### 3. Restart Cursor

After adding the config, restart Cursor for the changes to take effect.

### 4. Verify

Start a new conversation in Cursor's chat panel. OpenRot will have access to:
- `openrot_new_session` — starts tracking
- `openrot_check` — checks for contradictions
- `openrot_status` — shows tracked decisions
- `openrot_dismiss` — dismisses a warning

You can also run:

```bash
openrot test
```

This will verify that the MCP server starts correctly.

## How it works with Cursor

Cursor supports MCP servers via its settings. When OpenRot is configured:

1. At the start of a conversation, Cursor calls `openrot_new_session`
2. After each AI response, it calls `openrot_check` with the response content
3. If a contradiction is detected, the warning appears in the chat
4. You can dismiss false positives with `openrot_dismiss`

## Troubleshooting

**OpenRot not showing up in Cursor:**
- Check that `~/.cursor/mcp.json` is valid JSON
- Make sure `openrot` is in your PATH
- Check the log file at `~/.openrot/openrot.log`
- Try restarting Cursor completely

**No warnings firing:**
- Run `openrot status` to see tracked decisions
- Lower sensitivity: run `openrot config` and set to "high"
- Make sure you're making explicit decisions ("let's use X", "always Y")
