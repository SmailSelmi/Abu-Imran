type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

class Logger {
  private formatMessage(level: LogLevel, message: string, source?: string) {
    const timestamp = new Date().toISOString();
    const sourceStr = source ? `[${source}] ` : "";
    return `${timestamp} [${level}] ${sourceStr}${message}`;
  }

  info(message: string, source?: string) {
    console.log(this.formatMessage("INFO", message, source));
  }

  warn(message: string, source?: string) {
    console.warn(this.formatMessage("WARN", message, source));
  }

  error(message: string, source?: string) {
    console.error(this.formatMessage("ERROR", message, source));
  }

  debug(message: string, source?: string) {
    if (process.env.NODE_ENV !== "production") {
      console.log(this.formatMessage("DEBUG", message, source));
    }
  }
}

export const logger = new Logger();
