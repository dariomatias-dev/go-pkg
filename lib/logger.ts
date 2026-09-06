type LogLevel = "info" | "warn" | "error";

interface LogFields {
  route: string;
  durationMs?: number;
  status?: number;
  [key: string]: unknown;
}

/**
 * Structured JSON logging for API routes. Never pass request bodies,
 * user messages, or API keys in `fields` — only route/status/duration
 * and error identifiers safe to keep in log storage.
 */
function log(level: LogLevel, message: string, fields: LogFields) {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...fields,
  };

  const line = JSON.stringify(entry);

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

export const logger = {
  info: (message: string, fields: LogFields) => log("info", message, fields),
  warn: (message: string, fields: LogFields) => log("warn", message, fields),
  error: (message: string, fields: LogFields) => log("error", message, fields),
};
