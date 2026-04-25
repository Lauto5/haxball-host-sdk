
import { ILogger, IMetrics , ConsoleLogger, ConsoleMetrics , LogLevel } from "../core/observability";

export class ObservabilityConfig {
  
  logging: ILogger;
  
  metrics?: IMetrics;
  
  constructor(levelLogger?: LogLevel, logger?: ILogger, metrics?: IMetrics) {    
    
    const Ilogger: ILogger = logger ?? new ConsoleLogger(levelLogger ?? LogLevel.INFO);
    
    if (metrics) {
      this.metrics = metrics;
    }
    
    this.logging = Ilogger;
    
  }
  
}