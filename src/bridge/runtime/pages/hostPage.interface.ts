import { RoomConfig } from "#/types/haxball";
import { BrowserResponse } from "../responses/browserResponse.interface";


export interface IHostPage {
  navigate(url: string): Promise<void>;
  injectEnvironmentBuilder(): Promise<void>;
  launchHost(config: RoomConfig): Promise<void>;
  execute(method: string, args: any[]): Promise<BrowserResponse>;
  on(callback: (data: BrowserResponse) => void): void;
  close(): Promise<void>;
}