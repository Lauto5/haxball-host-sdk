import { RoomConfig } from "#/types/haxball";
import { Response } from "../responses/eventResponse.interface";

export interface IHostPage {
  navigate(url: string): Promise<void>;
  injectEnvironmentBuilder(): Promise<void>;
  launchHost(config: RoomConfig): Promise<void>;
  execute(method: string, args: any[]): Promise<any>;
  on(callback: (data: Response) => void): void;
  close(): Promise<void>;
}