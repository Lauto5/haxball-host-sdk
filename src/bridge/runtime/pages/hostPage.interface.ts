import { RoomConfig } from "#/types/haxball";
import { BrowserResponse } from "../responses/browserResponse.interface";


export interface IHostPage {
  urlHost: string | undefined;
  isActive: boolean;
  navigate(url: string): Promise<void>;
  injectEnvironmentBuilder(): Promise<void>;
  launchHost(config: RoomConfig): Promise<void>;
  execute(method: string, args: any[]): Promise<BrowserResponse>;
  on(callback: (data: BrowserResponse) => void): void;
  close(): Promise<void>;
  getUrlHost(): string;
  handleAlive(): Promise<void>;
  onHostDeath(callback: (pageId: string) => void): void;
  isAlive(): Promise<boolean>;
}