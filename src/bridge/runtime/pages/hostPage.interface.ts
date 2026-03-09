import { RoomConfig } from "#/types/haxball";
import { EventResponse } from "../events/eventResponse.interface";

export interface IHostPage {
  navigate(url: string): Promise<void>;
  injectEnvironmentBuilder(): Promise<void>;
  launchHost(config: RoomConfig): Promise<void>;
  execute(method: string, args: any[]): Promise<any>;
  on(callback: (data: EventResponse) => void): void;
  close(): Promise<void>;
}