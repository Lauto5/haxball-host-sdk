
/**
 * Represents the log level.
 * *OFF : 0
 * *ERROR : 1
 * *WARN : 2
 * *INFO : 3
 * *DEBUG : 4
 * *TRACE : 5
 */
export enum LogLevel {
  /**
   * No logging.
   */
  OFF = 0,
  /**
   * Logs only error messages.
   */
  ERROR = 1,
  /**
   * Logs warning messages.
   */
  WARN = 2,
  /**
   * Logs informational messages.
   */
  INFO = 3,
  /**
   * Logs debug messages.
   */
  DEBUG = 4,
  /**
   * Logs trace messages.
   * **IMPORTANT**: This level should only be used for debugging purposes, not recommended for production use.
   */
  TRACE = 5,
}