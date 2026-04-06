import { RoomConfig } from "#/types/haxball";
import { BrowserResponse } from "../responses/browserResponse.interface";
import { MethodRequest } from "../requests/methodRequest.interface";
import { IRequestProcess } from "./requestProcess/requestProcess.interface"


export interface IHostPage {
  urlHost: string | undefined;
  isActive: boolean;
  
  requestProcess: IRequestProcess;
  
  
  navigate(url: string): Promise<void>;
  injectEnvironmentBuilder(): Promise<void>;
  launchHost(config: RoomConfig): Promise<void>;
  
  execute(request: MethodRequest): Promise<BrowserResponse>;
  on(callback: (data: BrowserResponse) => void): void;
  close(): Promise<void>;
  getUrlHost(): string;
  handleAlive(): Promise<void>;
  onHostDeath(callback: (pageId: string) => void): void;
  isAlive(): Promise<boolean>;
}