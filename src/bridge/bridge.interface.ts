import { RoomConfig } from "../types/haxball";
import { ILogger } from "../logger";
import { BridgeLaunchConfig } from "../types/haxball";
import { BrowserResponse } from "./runtime";

export interface IBridge {
  
  url :string | undefined

  // =========================
  // LIFECYCLE
  // =========================
  
  init(rootLogger: ILogger, config: BridgeLaunchConfig): Promise<void>;
  close(): Promise<void>;

  // =========================
  // ROOM MANAGEMENT
  // =========================
  
  launchRoom(config: RoomConfig, url: string): Promise<void>;
  restartRoom(config: RoomConfig): Promise<void>;
  closeRoom(id: string): Promise<void>;

  // =========================
  // COMMUNICATION
  // =========================

  execute(id: string, method: string, args: unknown[]): Promise<BrowserResponse>;
  on(callback: (data: BrowserResponse) => void): void;

}