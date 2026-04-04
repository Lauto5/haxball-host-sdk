import { ILogger, ScopedLogger } from "../logger";
import { RuntimeFactory, EventResponse } from "./runtime";
import { RoomConfig, BridgeLaunchConfig } from "../types/haxball";
import { IBridge } from "./bridge.interface";
import { IRuntime } from "./runtime/runtimeBrowser/runtime.interface";
import { EventEmitter } from "stream";

export class Bridge implements IBridge {

  private logger: ILogger;
  private runtime?: IRuntime;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor(rootLogger: ILogger) {
    this.logger = new ScopedLogger(rootLogger, "Bridge");
  }

  // =========================
  // LIFECYCLE
  // =========================

  async init(rootLogger: ILogger, config: BridgeLaunchConfig): Promise<void> {
    
    const runtimeFactory = new RuntimeFactory();
    
    this.runtime = await runtimeFactory.getRuntime(rootLogger, config);
    
    this.logger.debug("Bridge initialized");
    
  }

  async close(): Promise<void> {
    
    if (this.runtime) {
      
      await this.runtime.close();
      
    }
    
    this.logger.debug("Bridge closed");
  }

  // =========================
  // ROOM MANAGEMENT
  // =========================

  async launchRoom(config: RoomConfig, url: string): Promise<void> {
    
    if (!this.runtime) throw new Error("Bridge not initialized. Call init() first.");

    await this.runtime.launchPage(this.logger, config.roomName, url, config);

    this.runtime.on((data: EventResponse) => {
      
      this.eventEmitter.emit("onEvent", data);
      
    });

    this.logger.debug("Room launched", { roomName: config.roomName });
    
  }

  async closeRoom(id: string): Promise<void> {

    await this.runtime!.closePage(id);
    
    this.logger.debug("Room closed", { id });
    
  }

  // =========================
  // COMMUNICATION
  // =========================

  async execute(id: string, method: string, args: unknown[]): Promise<unknown> {
    
    return this.runtime?.execute(id, method, args);
    
  }
  
  on(callback: (data: EventResponse) => void): void {
    
    this.eventEmitter.on("onEvent", callback);
    
  }
  
}
