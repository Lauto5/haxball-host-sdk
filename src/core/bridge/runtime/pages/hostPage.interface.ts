import { RoomConfig } from "../../../domain";
import { BrowserResponse , ErrorResponse , LiveRoomResponse } from "../responses";
import { MethodRequest } from "../requests";
import { IRequestProcess } from "./requestProcess";
import { ITrace } from "../../../observability";


export interface IHostPage {
  
  urlHost: string | undefined;
  
  isActive: boolean;
  
  requestProcess: IRequestProcess;
  
  
  navigate(url: string): Promise<void>;
  injectEnvironmentBuilder(): Promise<void>;
  launchHost(config: RoomConfig, trace: ITrace): Promise<void>;
  
  execute(request: MethodRequest, trace: ITrace): Promise<BrowserResponse>;
  on(callback: (data: BrowserResponse) => void): void;
  close(): Promise<void>;
  getUrlHost(): string;
  handleAlive(): Promise<void>;
  onHostDeath(callback: (pageId: string) => void): void;
  isAlive(): Promise<ErrorResponse | LiveRoomResponse>;
}