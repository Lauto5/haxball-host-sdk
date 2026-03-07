import { RoomConfig } from "#/types/haxball";

export interface IHostPage {
  navigate(url: string): Promise<void>;
  injectEnvironmentBuilder(): Promise<void>;
  launchHost(config: RoomConfig): Promise<void>;
  execute(method: string, args: any[]): Promise<any>;
  close(): Promise<void>;
}