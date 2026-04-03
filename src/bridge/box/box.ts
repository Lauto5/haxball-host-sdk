import { IBox } from "./box.interface";
import { IRoomExecutor } from "./roomExecutor.interface";
import { EventEmitter } from "events";
import { EventResponse } from "../runtime";


export class Box implements IBox {
  private eventEmitter: EventEmitter = new EventEmitter();
  private id: string;
  
  constructor(
    id: string,
    private readonly executor: IRoomExecutor,
  ) {
    this.id = id;
  }

  async execute(method: string, args: unknown[]): Promise<unknown> {
    return this.executor.execute(this.id, method, args);
  }
  
  on(callback: (data: EventResponse) => void): void {
    this.eventEmitter.on("onBoxEvent", callback);
  }

  emit(data: EventResponse): void {
    this.eventEmitter.emit("onBoxEvent", data);
  }
}