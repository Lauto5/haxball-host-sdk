import { IMetrics } from "../interfaces/metrics.interface";

export class ConsoleMetrics implements IMetrics {

  increment(name: string, value: number = 1, labels?: Record<string, string>): void {
    console.log(this.format("INC", name, value, labels));
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    console.log(this.format("GAUGE", name, value, labels));
  }

  observe(name: string, value: number, labels?: Record<string, string>): void {
    console.log(this.format("OBS", name, value, labels));
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