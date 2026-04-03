import { RoomConfig } from "../types/haxball";
import { ILogger } from "../logger";
import { BridgeLaunchConfig } from "../types/haxball";
import {EventResponse} from "./runtime"

export interface IBridge {

  // =========================
  // LIFECYCLE
  // =========================
  
  init(rootLogger: ILogger, config: BridgeLaunchConfig): Promise<void>;
  close(): Promise<void>;

  // =========================
  // ROOM MANAGEMENT
  // =========================
  
  launchBox(config: RoomConfig): Promise<string>;   // retorna boxId
  closeBox(boxId: string): Promise<void>;

  // =========================
  // COMMUNICATION
  // =========================

  execute(boxId: string, method: string, args: unknown[]): Promise<unknown>;
  on(callback: (data: EventResponse) => void): void;

}