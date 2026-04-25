import { randomUUID } from "crypto";
import { ITrace } from "../interfaces/trace.interface";
import { ISpan } from "../interfaces/span.interface";
import { SimpleSpan } from "./simpleSpan";
import { ILogger, IMetrics } from "../../../observability";

export class SimpleTrace implements ITrace {

  public readonly traceId: string;

  constructor(
    private readonly logger?: ILogger,
    private readonly metrics?: IMetrics,
    private readonly name?: string
  ) {
    this.traceId = randomUUID();

    this.logger?.trace("Trace started", {
      traceId: this.traceId,
      name: this.name,
    });
  }

  startSpan(name: string): ISpan {
    return new SimpleSpan(this.traceId, name, this.logger, this.metrics);
  }

}