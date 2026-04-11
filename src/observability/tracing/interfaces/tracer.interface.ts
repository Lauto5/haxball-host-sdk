
import { ITrace } from "./trace.interface";

export interface ITracer {
  startTrace(name?: string): ITrace;
}