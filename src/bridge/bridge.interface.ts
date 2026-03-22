import { RoomConfig } from "../types/haxball";
import { ILogger } from "../logger";
import { ITransport } from "./transport/transport.interface";
import { BridgeLaunchConfig } from "../types/haxball";


export interface IBridge {
  
  launchBridge(rootLogger: ILogger, transport: ITransport, bridgeLaunchConfig: BridgeLaunchConfig): Promise<void>;
  launchBox(roomConfig: RoomConfig): void;
  
}