import { RoomConfig } from "../types/haxball";
import { ILogger } from "../logger";
import { IRPCChannel } from "./rpc/rpcchannel.interface";
import { ITransport } from "./transport/transport.interface";

export interface IBridge {
  
  launchBridge(rootLogger: ILogger , transport: ITransport): Promise<void>;
  launchBox(roomConfig: RoomConfig): void;
  
}