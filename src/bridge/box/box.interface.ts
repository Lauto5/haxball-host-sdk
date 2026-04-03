import { EventEmitter } from "stream";
import { EventResponse } from "../runtime";

export interface IBox {
  execute(method: string, args: any[]): Promise<any>;
  on(callback: (data: EventResponse) => void): void;
  emit(data: EventResponse): void;
}