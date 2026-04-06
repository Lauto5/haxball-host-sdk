
import { ILogger } from './logger/interfaces/logger.interface';
import { IMetrics } from './metrics/interfaces/metrics.interface';

export class Observability {

  public readonly logger: ILogger;
  public readonly metrics: IMetrics;

  constructor(logger: ILogger, metrics: IMetrics) {
    this.logger = logger;
    this.metrics = metrics;
  }

}