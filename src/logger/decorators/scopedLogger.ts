import { ILogger } from "../interfaces/logger.interface"


export class ScopedLogger implements ILogger {
  constructor(
    private base: ILogger,
    private scope: string
  ) {}

  private format(message: string) {
    return `[${this.scope}] ${message}`
  }

  debug(message: string, meta?: unknown) {
    this.base.debug(this.format(message), meta)
  }

  info(message: string, meta?: unknown) {
    this.base.info(this.format(message), meta)
  }

  warn(message: string, meta?: unknown) {
    this.base.warn(this.format(message), meta)
  }

  error(message: string, meta?: unknown) {
    this.base.error(this.format(message), meta)
  }
}