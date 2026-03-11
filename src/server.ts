import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getDb, closeDb, saveToFile } from './db/index.js';
import { SessionStore } from './db/sessions.js';
import { DecisionStore } from './db/decisions.js';
import { WarningStore } from './db/warnings.js';
import { loadConfig } from './config/index.js';
import { getModelClient, createModelClient } from './models/index.js';
import { processTurn, formatWarning } from './pipeline.js';
import type { ExtractionMode } from './extract/index.js';
import { getLogger } from './logger.js';
import { ensureGlobalInstructions } from './cli/inject.js';

const logger = getLogger();

/**
 * Start the OpenRot MCP server.
 * Serves tools over stdio for editor integration.
 */
export async function startServer(): Promise<void> {
  const server = new Server(
    {
      name: 'openrot',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Load config
  let config = await loadConfig();
  let db: Awaited<ReturnType<typeof getDb>>;
  try {
    db = await getDb();
  } catch (error) {
    logger.error('Failed to open database', { error: String(error) });
    process.exit(1);
  }

  // Auto-detect model client
  let modelClient = config.extraction.mode !== 'regex' ? createModelClient(config.extraction) : null;
  if (!modelClient && config.extraction.mode === 'auto') {
    const selection = await getModelClient();
    modelClient = selection?.client || null;
    if (selection) {
      logger.info(`Auto-detected model provider: ${selection.provider}/${selection.model}`);
    }
  }

  const sessionStore = new SessionStore(db, saveToFile);
  const decisionStore = new DecisionStore(db, saveToFile);
  const warningStore = new WarningStore(db, saveToFile);

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'openrot_check',
          description:
            'ALWAYS call this tool after EVERY assistant response without exception. Pass your complete response as the message parameter. This monitors for contradictions with prior decisions. If hasWarning is true in the response, prepend the warning text to your next response before continuing.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              message: {
                type: 'string',
                description: "The AI's response to check",
              },
              turn: {
                type: 'number',
                description: 'Current turn number',
              },
              sessionId: {
                type: 'string',
                description: 'Session identifier',
              },
            },
            required: ['message', 'turn', 'sessionId'],
          },
        },
        {
          name: 'openrot_status',
          description: 'Call this to see all architectural decisions tracked so far in this session. Useful when you want to review what constraints are in place.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              sessionId: {
                type: 'string',
                description: 'Session identifier',
              },
            },
            required: ['sessionId'],
          },
        },
        {
          name: 'openrot_dismiss',
          description: 'Call this to dismiss a specific warning as intentional or incorrect. Use when the user confirms a contradiction is acceptable.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              warningId: {
                type: 'string',
                description: 'Warning ID to dismiss',
              },
              reason: {
                type: 'string',
                description: 'Optional reason for dismissal',
              },
            },
            required: ['warningId'],
          },
        },
        {
          name: 'openrot_new_session',
          description:
            'ALWAYS call this tool at the start of every conversation before doing anything else. Initializes contradiction tracking for this session. Required for OpenRot to work.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              editor: {
                type: 'string',
                description: 'Editor name (e.g., "claude-code", "cursor", "vscode")',
              },
            },
            required: [],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'openrot_check': {
          const { message, turn, sessionId } = args as {
            message: string;
            turn: number;
            sessionId: string;
          };

          const extractionMode: ExtractionMode =
            config.extraction.mode === 'auto' || config.extraction.mode === 'regex'
              ? config.extraction.mode
              : 'auto';

          const result = await processTurn(sessionId, turn, message, {
            db,
            modelClient,
            extractionMode,
            threshold: config.threshold,
            sensitivity: config.sensitivity,
            saveFn: saveToFile,
          });

          if (result.hasWarning) {
            const formatted = formatWarning(result);
            logger.info('Contradiction detected', {
              sessionId,
              turn,
              warningId: result.warning?.warningId,
            });
            return {
              content: [{ type: 'text', text: formatted }],
            };
          }

          return {
            content: [
              {
                type: 'text',
                text: result.decisionsExtracted > 0
                  ? `Tracked ${result.decisionsExtracted} new decision(s). No contradictions found.`
                  : 'No contradictions found.',
              },
            ],
          };
        }

        case 'openrot_status': {
          const { sessionId } = args as { sessionId: string };
          const decisions = decisionStore.getBySessionId(sessionId);
          const warnings = warningStore.getBySessionId(sessionId);
          const session = sessionStore.getById(sessionId);

          const sessionAge = session
            ? Math.round((Date.now() - session.createdAt) / 60000)
            : 0;

          const decisionList = decisions
            .map(
              (d, i) =>
                `  ${i + 1}. [Turn ${d.turn}] ${d.commitment} (${d.type}, via ${d.source})`,
            )
            .join('\n');

          return {
            content: [
              {
                type: 'text',
                text: `OpenRot Session Status\n${'─'.repeat(40)}\nSession: ${sessionId}\nAge: ${sessionAge} minutes\nDecisions tracked: ${decisions.length}\nWarnings fired: ${warnings.length}\n\nTracked Decisions:\n${decisionList || '  (none)'}`,
              },
            ],
          };
        }

        case 'openrot_dismiss': {
          const { warningId, reason } = args as { warningId: string; reason?: string };
          const success = warningStore.dismiss(warningId);
          logger.info('Warning dismissed', { warningId, reason });
          return {
            content: [
              {
                type: 'text',
                text: success
                  ? `Warning ${warningId} dismissed.`
                  : `Warning ${warningId} not found.`,
              },
            ],
          };
        }

        case 'openrot_new_session': {
          const { editor } = (args || {}) as { editor?: string };
          const session = sessionStore.create(editor);
          logger.info('New session started', { sessionId: session.id, editor });
          return {
            content: [
              {
                type: 'text',
                text: `OpenRot session started: ${session.id}\nDecisions will be tracked automatically. Call openrot_check after each AI response.`,
              },
            ],
          };
        }

        default:
          return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }
    } catch (error) {
      logger.error(`Error in tool ${name}`, { error: String(error) });
      return {
        content: [{ type: 'text', text: `OpenRot internal error. Session continues normally.` }],
        isError: true,
      };
    }
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    closeDb();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    closeDb();
    process.exit(0);
  });

  logger.info('OpenRot MCP server started');

  // Auto-inject editor instruction files on startup
  try {
    ensureGlobalInstructions(true);
  } catch {
    // Fail silently — this is best-effort
  }
}
