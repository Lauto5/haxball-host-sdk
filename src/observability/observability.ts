
import { ScopedLogger, ScopedMetrics, ILogger, IMetrics , ITracer, SimpleTracer } from './';


export class Observability {

  private readonly rootLogger: ILogger;
  private readonly rootMetrics: IMetrics;
  private readonly tracer: ITracer;

  constructor(logger: ILogger, metrics: IMetrics) {
    this.rootLogger = logger;
    this.rootMetrics = metrics;
    
    this.tracer = new SimpleTracer(this.rootLogger, this.rootMetrics);
    
  }
  
  createScopeLogger(scope: string): ILogger {
    return new ScopedLogger(this.rootLogger, scope);
  }

  createScopeMetrics(labels?: Record<string, string>): IMetrics {
    return new ScopedMetrics(this.rootMetrics, labels ?? {});
  }

  getTracer(): ITracer {
    return this.tracer;
  }

}