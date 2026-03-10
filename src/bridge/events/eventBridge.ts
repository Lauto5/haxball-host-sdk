import { ILogger, ScopedLogger } from "#/logger";
import { IRPCChannel } from "../rpc/rpcchannel.interface";
import { EventResponse } from "../runtime/events/eventResponse.interface";


export class EventBridge implements EventBridge {
  
  private logger: ILogger;
  private rpc: IRPCChannel;
  
  constructor(rootLogger: ILogger, rpc: IRPCChannel) {
    this.logger = new ScopedLogger(rootLogger, "EventBridge");
    this.rpc = rpc;
  }
  
  emitEvent(data: EventResponse): void{
    //this.rpc.call()
  }
  
}