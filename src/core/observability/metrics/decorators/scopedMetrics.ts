import { IMetrics } from '../interfaces/metrics.interface';

export class ScopedMetrics implements IMetrics {
  
  constructor(
    private readonly metrics: IMetrics,
    private readonly baseLabels: Record<string, string>
  ) {}

  increment(name: string, value = 1, labels?: Record<string, string>): void {
    this.metrics.increment(name, value, {
      ...this.baseLabels,
      ...labels,
    });
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    this.metrics.gauge(name, value, {
      ...this.baseLabels,
      ...labels,
    });
  }

  observe(name: string, value: number, labels?: Record<string, string>): void {
    this.metrics.observe(name, value, {
      ...this.baseLabels,
      ...labels,
    });
  }
}