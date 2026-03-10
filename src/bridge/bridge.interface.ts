import { ILogger } from "../logger";
import { IRPCChannel } from "./rpc/rpcchannel.interface";
import { ITransport } from "./transport/transport.interface";

export interface IBridge {
  
  launchBridge(rootLogger: ILogger): Promise<void>;
  setupTransport(transport: ITransport): void;
  connectRPC(handle:IRPCChannel): void;
  
}