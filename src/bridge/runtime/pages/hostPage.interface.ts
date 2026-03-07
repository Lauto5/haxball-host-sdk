import { RoomConfig } from "#/types/haxball";

export interface IHostPage {
  injectEnvironmentBuilder(): Promise<void>;
  launchHost(config: RoomConfig): Promise<void>;
  execute(method: string, args: any[]): Promise<any>;
  
}