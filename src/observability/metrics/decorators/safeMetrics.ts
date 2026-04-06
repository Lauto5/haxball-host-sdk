
import { IMetrics } from '../interfaces/metrics.interface';


export class SafeMetrics implements IMetrics {
  
  constructor(private readonly metrics: IMetrics) {}

  increment(name: string, value?: number, labels?: Record<string, string>): void {
    try {
      this.metrics.increment(name, value, labels);
    } catch {}
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    try {
      this.metrics.gauge(name, value, labels);
    } catch {}
  }

  observe(name: string, value: number, labels?: Record<string, string>): void {
    try {
      this.metrics.observe(name, value, labels);
    } catch {}
  }
}