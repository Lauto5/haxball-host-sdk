import { RoomConfig } from "../types/haxball";
import { ILogger } from "../observability/logger";
import { BridgeLaunchConfig } from "../types/haxball";
import { BrowserResponse , MethodRequest} from "./runtime";

export interface IBridge {
  
  url: string | undefined,

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
  
  onRoomDeath(callback: () => void): void;
  
  getUrlRoom(id: string): string;

  // =========================
  // COMMUNICATION
  // =========================

  execute(request: MethodRequest): Promise<BrowserResponse>;
  on(callback: (data: BrowserResponse) => void): void;

}