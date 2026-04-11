
import { ISpan } from "./span.interface";

export interface ITrace {
  traceId: string;
  startSpan(name: string): ISpan;
}