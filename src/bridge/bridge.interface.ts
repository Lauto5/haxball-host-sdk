import { ILogger } from "../logger";
import { ITransport } from "./transport/transport.interface";

export interface IBridge {
  
  launchBridge(rootLogger: ILogger): Promise<void>;
  setupTransport(transport: ITransport): void;
  
}