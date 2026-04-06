import { RoomConfig } from "../types/haxball";
import { ILogger, Observability } from "../observability";
import { BridgeLaunchConfig } from "../types/haxball";
import { BrowserResponse , MethodRequest} from "./runtime";

export interface IBridge {

  // =========================
  // LIFECYCLE
  // =========================
  
  init(obs: Observability, config: BridgeLaunchConfig): Promise<void>;
  close(): Promise<void>;

  // =========================
  // ROOM MANAGEMENT
  // =========================
  
  launchRoom(obs : Observability,config: RoomConfig, url: string): Promise<void>;
  restartRoom(obs : Observability,config: RoomConfig): Promise<void>;
  closeRoom(id: string): Promise<void>;
  
  onRoomDeath(callback: () => void): void;
  
  getUrlRoom(id: string): string;

  // =========================
  // COMMUNICATION
  // =========================

  execute(request: MethodRequest): Promise<BrowserResponse>;
  on(callback: (data: BrowserResponse) => void): void;

}