import { randomUUID } from "crypto";
import { ISpan } from "../interfaces/span.interface";

import { ILogger, IMetrics } from "../../../observability";

export class SimpleSpan implements ISpan {

  public readonly spanId: string;

  private startTime: number;

  constructor(
    private readonly traceId: string,
    private readonly name: string,
    private readonly logger?: ILogger,
    private readonly metrics?: IMetrics
  ) {
    this.spanId = randomUUID();
    this.startTime = Date.now();

    this.logger?.trace("Span started", {
      traceId: this.traceId,
      spanId: this.spanId,
      name: this.name,
    });
  }

  end(): void {
    const duration = Date.now() - this.startTime;

    this.logger?.trace("Span ended", {
      traceId: this.traceId,
      spanId: this.spanId,
      duration,
      name: this.name,
    });

    this.metrics?.observe("trace.span.duration", duration, {
      span: this.name,
    });
  }

}