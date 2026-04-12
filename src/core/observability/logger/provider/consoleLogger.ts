import { LogLevel } from "../constants";
import { ILogger } from "../interfaces/logger.interface";


export class ConsoleLogger implements ILogger {
  constructor(private level: LogLevel = LogLevel.INFO) {}

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  debug(message: string, meta?: unknown): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.debug(this.formatMessage("DEBUG", message), meta ?? "");
  }

  info(message: string, meta?: unknown): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.info(this.formatMessage("INFO", message), meta ?? "");
  }

  warn(message: string, meta?: unknown): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage("WARN", message), meta ?? "");
  }

  error(message: string, meta?: unknown): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    console.error(this.formatMessage("ERROR", message), meta ?? "");
  }
  
  trace(message: string, meta?: unknown): void {
    if (!this.shouldLog(LogLevel.TRACE)) return;
    console.trace(this.formatMessage("TRACE", message), meta ?? "");
  }
}