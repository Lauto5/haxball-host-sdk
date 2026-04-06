
import { ScopedLogger, ScopedMetrics, ILogger, IMetrics } from './';


export class Observability {

  private readonly rootLogger: ILogger;
  private readonly rootMetrics: IMetrics;

  constructor(logger: ILogger, metrics: IMetrics) {
    this.rootLogger = logger;
    this.rootMetrics = metrics;
  }
  
  createScopeLogger(scope: string): ILogger {
    return new ScopedLogger(this.rootLogger, scope);
  }

  createScopeMetrics(labels?: Record<string, string>): IMetrics {
    return new ScopedMetrics(this.rootMetrics, labels ?? {});
  }

}