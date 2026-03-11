# OpenRot + Google Antigravity

## Setup

### 1. Install OpenRot

```bash
npm install -g openrot
openrot init
```

The init wizard will auto-detect Antigravity and output the config snippet.

### 2. Add MCP config

Add the following to your Antigravity `settings.json`:

```json
{
  "mcp.servers": {
    "openrot": {
      "command": "openrot",
      "args": ["serve"]
    }
  }
}
```

To open settings.json in Antigravity, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and type **"Preferences: Open User Settings (JSON)"**.

### 3. Restart Antigravity

After adding the config, restart Antigravity for the changes to take effect.

### 4. Verify

Start a new conversation in Antigravity's chat panel. OpenRot will have access to:
- `openrot_new_session` — starts tracking
- `openrot_check` — checks for contradictions
- `openrot_status` — shows tracked decisions
- `openrot_dismiss` — dismisses a warning

You can also run:

```bash
openrot test
```

This will verify that the MCP server starts correctly.

## How it works with Antigravity

Antigravity is a VS Code fork with native MCP support. When OpenRot is configured:

1. At the start of a conversation, Antigravity calls `openrot_new_session`
2. After each AI response, it calls `openrot_check` with the response content
3. If a contradiction is detected, the warning appears in the chat
4. You can dismiss false positives with `openrot_dismiss`

## Config file locations

| Platform | Path |
|----------|------|
| Windows | `%APPDATA%\Antigravity\User\settings.json` |
| macOS | `~/Library/Application Support/Antigravity/User/settings.json` |
| Linux | `~/.config/Antigravity/User/settings.json` |

## Troubleshooting

**OpenRot not showing up in Antigravity:**
- Check that `settings.json` contains valid JSON
- Make sure `openrot` is in your PATH (run `which openrot` or `where openrot`)
- Check the log file at `~/.openrot/openrot.log`
- Try restarting Antigravity completely

**No warnings firing:**
- Run `openrot status` to see tracked decisions
- Lower sensitivity: run `openrot config` and set to "high"
- Make sure you're making explicit decisions ("let's use X", "always Y")
