
import { ILogger, IMetrics , ConsoleLogger, ConsoleMetrics , LogLevel } from "../core/observability";

/**
 * Configuration for observability.
 */
export class ObservabilityConfig {
  
  /**
   * The logger instance.
   */
  logging: ILogger;
  
  /**
   * The metrics instance.
   */
  metrics?: IMetrics;

  /**
   * Creates a new ObservabilityConfig instance.
   * @param levelLogger The log level. @link {@link LogLevel}
   * @param logger The logger instance. @link {@link ILogger} , if not provided, a default {@link ConsoleLogger} will be used.
   * @param metrics The metrics instance. @link {@link IMetrics}
   */
  constructor(levelLogger?: LogLevel, logger?: ILogger, metrics?: IMetrics) {    
    
    const Ilogger: ILogger = logger ?? new ConsoleLogger(levelLogger ?? LogLevel.INFO);
    
    if (metrics) {
      this.metrics = metrics;
    }
    
    this.logging = Ilogger;
    
  }
  
}