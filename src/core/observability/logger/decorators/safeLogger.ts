import { ILogger } from "../interfaces/logger.interface"


export class SafeLogger implements ILogger {
  constructor(private base: ILogger) {}

  private call(method: keyof ILogger, message: string, meta?: unknown) {
    try {
      this.base[method](message, meta)
    } catch {
      // Nunca rompemos el SDK por culpa del logger
    }
  }

  debug(message: string, meta?: unknown) {
    this.call("debug", message, meta)
  }

  info(message: string, meta?: unknown) {
    this.call("info", message, meta)
  }

  warn(message: string, meta?: unknown) {
    this.call("warn", message, meta)
  }

  error(message: string, meta?: unknown) {
    this.call("error", message, meta)
  }
  
  trace(message: string, meta?: unknown) {
    this.call("trace", message, meta)
  }
  
}