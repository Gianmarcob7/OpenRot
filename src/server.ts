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
import { analyzeTranscript } from './detect/index.js';
import { getLogger } from './logger.js';
import { ensureGlobalInstructions } from './cli/inject.js';

const logger = getLogger();

/**
 * Start the OpenRot MCP server.
 * Serves tools over stdio for editor integration (Cursor, Antigravity, VS Code).
 */
export async function startServer(): Promise<void> {
  const server = new Server(
    {
      name: 'openrot',
      version: '2.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  let config = await loadConfig();
  let db: Awaited<ReturnType<typeof getDb>>;
  try {
    db = await getDb();
  } catch (error) {
    logger.error('Failed to open database', { error: String(error) });
    process.exit(1);
  }

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

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'openrot_check',
          description:
            'You have access to OpenRot, a session health monitor. Call this tool when you notice you\'re struggling — repeating the same approach, losing track of earlier decisions, or hitting the same error multiple times. It will tell you if your session context has degraded and suggest whether to continue or start fresh with preserved context.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              message: {
                type: 'string',
                description: "Your most recent response text to check for degradation signals",
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
          name: 'openrot_fix',
          description:
            'Generates a fresh start prompt that preserves all decisions and progress from this session. Call this when openrot_check indicates degradation, or when the developer asks to start fresh.',
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
          name: 'openrot_status',
          description: 'Show all architectural decisions tracked so far and current session health score. Call when you want to review constraints or check session quality.',
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
          description: 'Dismiss a specific warning as intentional. Use when the user confirms a contradiction is acceptable.',
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
            'Start a new OpenRot session. Call at the start of a conversation to initialize context tracking.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              editor: {
                type: 'string',
                description: 'Editor name (e.g., "cursor", "vscode", "antigravity")',
              },
            },
            required: [],
          },
        },
      ],
    };
  });

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
                  ? `Tracked ${result.decisionsExtracted} new decision(s). No contradictions found. Session health: OK.`
                  : 'No contradictions found. Session health: OK.',
              },
            ],
          };
        }

        case 'openrot_fix': {
          const { sessionId } = args as { sessionId: string };
          const decisions = decisionStore.getBySessionId(sessionId);

          if (decisions.length === 0) {
            return {
              content: [{ type: 'text', text: 'No decisions tracked in this session. Nothing to preserve.' }],
            };
          }

          const commitments = decisions.map((d) => `- ${d.commitment}`).join('\n');
          const handoff = `Continuing a previous session.\n\nDECISIONS MADE:\n${commitments}\n\nContinue from the current task.`;

          return {
            content: [{ type: 'text', text: `Handoff prompt generated:\n\n${handoff}` }],
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
                text: `OpenRot session started: ${session.id}\nOpenRot is now monitoring this session. If you find yourself repeating approaches, re-reading files you already read, or making errors you already fixed, call openrot_check to assess session health.`,
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

  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.on('SIGINT', () => {
    closeDb();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    closeDb();
    process.exit(0);
  });

  logger.info('OpenRot MCP server started');

  // Update editor instruction files with AI-awareness instructions
  try {
    ensureGlobalInstructions(true);
  } catch {
    // Best-effort
  }
}
