
import { ILogger, IMetrics , ConsoleLogger, ConsoleMetrics , LogLevel } from "../core/observability";

export class ObservabilityConfig {
  
  logging: ILogger;
  
  metrics: IMetrics;
  
  constructor(levelLogger?: LogLevel, logger?: ILogger, metrics?: IMetrics) {    
    
    const Ilogger : ILogger = logger ?? new ConsoleLogger(levelLogger ?? LogLevel.INFO);
    const Imetrics : IMetrics = metrics ?? new ConsoleMetrics(Ilogger);
    
    this.logging = Ilogger;
    this.metrics = Imetrics;
  }
  
}