

type LogLevel = "info" | "warn" | "error" | "debug";

function format(level: LogLevel, message: string, meta?: unknown) {
  return JSON.stringify({
    level,
    message,
    meta: meta ?? null,
    timestamp: new Date().toISOString()
  });
}

export const logger = {
  info(message: string, meta?: unknown) {
    console.error(format("info", message, meta));
  },

  warn(message: string, meta?: unknown) {
    console.warn(format("warn", message, meta));
  },

  error(message: string, meta?: unknown) {
    console.error(format("error", message, meta));
  },

  debug(message: string, meta?: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(format("debug", message, meta));
    }
  }
};