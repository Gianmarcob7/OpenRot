import winston from 'winston';
import path from 'path';
import os from 'os';
import fs from 'fs';

let logger: winston.Logger | null = null;

/**
 * Get the Winston logger instance.
 * Logs to ~/.openrot/openrot.log only (never stdout).
 */
export function getLogger(): winston.Logger {
  if (logger) return logger;

  const logDir = path.join(os.homedir(), '.openrot');
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  } catch {
    // If we can't create log dir, use a null transport
  }

  const logPath = path.join(logDir, 'openrot.log');

  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.File({
        filename: logPath,
        maxsize: 5 * 1024 * 1024, // 5MB
        maxFiles: 3,
      }),
    ],
    // Never log to console during normal operation
    silent: false,
  });

  return logger;
}

/**
 * Get a console-enabled logger for CLI output (used by `openrot test` and similar).
 */
export function getConsoleLogger(): winston.Logger {
  return winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  });
}
