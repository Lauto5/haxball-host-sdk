
import { ScopedLogger, ScopedMetrics, ILogger, IMetrics , ITracer, SimpleTracer } from './';


export class Observability {

  private readonly rootLogger: ILogger;
  private readonly rootMetrics?: IMetrics;
  private readonly tracer?: ITracer;

  constructor(logger: ILogger, metrics?: IMetrics) {
    this.rootLogger = logger;
    
    if (metrics) {
      this.rootMetrics = metrics;
      this.tracer = new SimpleTracer(this.rootLogger, this.rootMetrics);  
    }
    
  }
  
  isMetricsEnabled(): boolean {
    return !!this.rootMetrics;
  }
  
  createScopeLogger(scope: string): ILogger {
    return new ScopedLogger(this.rootLogger, scope);
  }

  createScopeMetrics(labels?: Record<string, string>): IMetrics {
    
    if (!this.rootMetrics) {
      
      throw new Error('Metrics are not configured');
      
    }
    
    return new ScopedMetrics(this.rootMetrics, labels ?? {});
  }

  getTracer(): ITracer {
    if (!this.tracer) {
      
      throw new Error('Tracer is not configured');
      
    }    
    return this.tracer;
  }

}