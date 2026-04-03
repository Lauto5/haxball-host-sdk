import { ILogger, ScopedLogger } from "../logger";
import { RuntimeFactory, EventResponse } from "./runtime";
import { RoomConfig, BridgeLaunchConfig } from "../types/haxball";
import { IBridge } from "./bridge.interface";
import { IBox } from "./box/box.interface";
import { IRuntime } from "./runtime/runtimeBrowser/runtime.interface";
import { Box } from "./box/box";
import { RoomExecutor } from "./box/roomExecutor";
import { IRoomExecutor } from "./box/roomExecutor.interface";
import { EventEmitter } from "stream";

const HAXBALL_URL = "https://www.haxball.com/headless";

export class Bridge implements IBridge {

  private logger: ILogger;
  private runtime?: IRuntime;
  private boxes = new Map<string, IBox>();
  private roomExecutor: IRoomExecutor;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor(rootLogger: ILogger) {
    this.logger = new ScopedLogger(rootLogger, "Bridge");
    this.roomExecutor = new RoomExecutor()
  }

  // =========================
  // LIFECYCLE
  // =========================

  async init(rootLogger: ILogger, config: BridgeLaunchConfig): Promise<void> {
    
    const runtimeFactory = new RuntimeFactory();
    
    this.runtime = await runtimeFactory.getRuntime(rootLogger, config);
    
    this.roomExecutor.inject(this.runtime);
    
    this.logger.debug("Bridge initialized");
    
  }

  async close(): Promise<void> {
    // cierra todas las boxes activas
    const closePromises = Array.from(this.boxes.keys()).map(boxId =>
      this.closeBox(boxId)
    );
    await Promise.all(closePromises);
    
    if (this.runtime) {
      
      await this.runtime.close();
      
    }
    
    this.logger.debug("Bridge closed");
  }

  // =========================
  // ROOM MANAGEMENT
  // =========================

  async launchBox(config: RoomConfig): Promise<string> {
    if (!this.runtime) throw new Error("Bridge not initialized. Call init() first.");

    const boxId = config.roomName;

    if (this.boxes.has(boxId)) {
      throw new Error(`Box "${boxId}" already exists`);
    }

    await this.runtime.launchPage(this.logger, boxId, HAXBALL_URL, config);
    
    const box = new Box(boxId, this.roomExecutor);

    this.runtime.on((data: EventResponse) => {
      
      this.eventEmitter.emit("onEvent", data);
      
    });

    this.boxes.set(boxId, box);

    this.logger.debug("Box launched", { boxId });

    return boxId;
    
  }

  async closeBox(boxId: string): Promise<void> {
    
    const box = this.boxes.get(boxId);
    
    if (!box) throw new Error(`Box "${boxId}" not found`);

    await this.runtime!.closePage(boxId);
    
    this.boxes.delete(boxId);

    this.logger.debug("Box closed", { boxId });
    
  }

  // =========================
  // COMMUNICATION
  // =========================

  async execute(boxId: string, method: string, args: unknown[]): Promise<unknown> {
    
    const box = this.boxes.get(boxId);
    
    if (!box) throw new Error(`Box "${boxId}" not found`);
    
    return box.execute(method, args);
    
  }
  
  on(callback: (data: EventResponse) => void): void {
    
    this.eventEmitter.on("onEvent", callback);
    
  }
  
  
}
