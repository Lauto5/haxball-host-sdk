import { IMetrics } from "../interfaces/metrics.interface";

import { ILogger } from "../../../observability/logger";

export class ConsoleMetrics implements IMetrics {

  constructor(private logger: ILogger) {}
  
  increment(name: string, value: number = 1, labels?: Record<string, string>): void {
    this.logger.debug(this.format("INC", name, value, labels));
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    this.logger.debug(this.format("GAUGE", name, value, labels));
  }

  observe(name: string, value: number, labels?: Record<string, string>): void {
    this.logger.debug(this.format("OBS", name, value, labels));
  }

  private format(
    type: string,
    name: string,
    value: number,
    labels?: Record<string, string>
  ): string {
    const labelStr = labels
      ? Object.entries(labels)
          .map(([k, v]) => `${k}=${v}`)
          .join(" ")
      : "";

    return `[metrics] ${type} ${name}=${value} ${labelStr}`;
  }
}