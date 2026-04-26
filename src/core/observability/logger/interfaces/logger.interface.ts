
/**
 * Interface for the logger.
 * 
 * **Implementation:** 
 * 
 * @example
 * ```typescript
 * const logger: ILogger = {
 *   debug: (message: string, meta?: unknown) => {
 *     console.log(message, meta)
 *   },
 *   info: (message: string, meta?: unknown) => {
 *     console.log(message, meta)
 *   },
 *   warn: (message: string, meta?: unknown) => {
 *     console.log(message, meta)
 *   },
 *   error: (message: string, meta?: unknown) => {
 *     console.log(message, meta)
 *   },
 *   trace: (message: string, meta?: unknown) => {
 *     console.log(message, meta)
 *   },
 * }
 * ```
 * 
 */
export interface ILogger {
  debug(message: string, meta?: unknown): void
  info(message: string, meta?: unknown): void
  warn(message: string, meta?: unknown): void
  error(message: string, meta?: unknown): void
  trace(message: string, meta?: unknown): void
}