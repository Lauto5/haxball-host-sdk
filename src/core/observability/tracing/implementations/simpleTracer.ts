import { ITracer } from "../interfaces/tracer.interface";
import { ITrace } from "../interfaces/trace.interface";
import { ILogger , IMetrics} from "../../../observability";
import { SimpleTrace } from "./simpleTrace";

export class SimpleTracer implements ITracer {

  constructor(private readonly logger?: ILogger, private readonly metrics?: IMetrics) {}

  startTrace(name?: string): ITrace {
    return new SimpleTrace(this.logger, this.metrics, name);
  }

}