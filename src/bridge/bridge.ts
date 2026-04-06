import { ILogger, IMetrics, Observability} from "../observability";
import { RuntimeFactory, BrowserResponse , IRuntime , MethodRequest} from "./runtime";
import { RoomConfig, BridgeLaunchConfig } from "../types/haxball";
import { IBridge } from "./bridge.interface";
import { EventEmitter } from "stream";

export class Bridge implements IBridge {

  private url: string | undefined;
  private logger: ILogger;
  private metrics: IMetrics;
  private runtime?: IRuntime;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor(obs: Observability) {
    
    this.logger = obs.createScopeLogger("Bridge");
    
    this.metrics = obs.createScopeMetrics({ layer: "bridge" });
    
  }

  // =========================
  // LIFECYCLE
  // =========================

  async init(obs: Observability, config: BridgeLaunchConfig): Promise<void> {
    
    const runtimeFactory = new RuntimeFactory();
    
    this.runtime = await runtimeFactory.getRuntime(obs, config);
    
    this.runtime.on((data: BrowserResponse) => {
      
      if (data.method !== "onGameTick") {
        
        this.metrics.increment("bridge.event.received", 1, {
          method: data.method,
        });
      
        this.eventEmitter.emit("onEvent", data);
          
      }
    
    });
    
    this.runtime.onHostDeath((pageId: string) => {
    
      this.metrics.increment("bridge.room.death", 1, {
        roomId: pageId,
      });
    
      this.eventEmitter.emit("onHostDeath", pageId);
    
    });
    
    this.metrics.increment("bridge.init");
    
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

  async launchRoom(obs : Observability,config: RoomConfig, url: string): Promise<void> {
    
    if (!this.runtime) throw new Error("Bridge not initialized. Call init() first.");

    if (this.url === undefined) {
      this.url = url;
    }
    
    await this.runtime.launchPage(obs, config.roomName, url, config);

    this.metrics.increment("bridge.room.launch");
    
    this.logger.info("Room launched", { roomName: config.roomName });
    
  }
  
  async restartRoom(obs : Observability,config: RoomConfig): Promise<void> {
    
    if (!this.runtime || this.url === undefined) throw new Error("Bridge not initialized. Call init() first.");
    
    await this.runtime.closePage(config.roomName);
    
    await this.launchRoom(obs,config, this.url);
    
    this.metrics.increment("bridge.room.restart");
    
    this.logger.info('Room restart sucessfully : ', config.roomName);
    
  }

  async closeRoom(id: string): Promise<void> {
    
    await this.runtime!.closePage(id);
    
    this.metrics.increment("bridge.room.close");
    
    this.logger.info("Room closed", { id });
    
  }
  
  onRoomDeath(callback: (pageId: string) => void): void {
    
    this.eventEmitter.on("onHostDeath", callback);
    
  }
  
  getUrlRoom(id: string): string {
    
    if (!this.runtime) throw new Error("Bridge not initialized. Call init() first.");
    
    return this.runtime.getUrlHost(id);
    
  }

  // =========================
  // COMMUNICATION
  // =========================

  async execute(request: MethodRequest): Promise<BrowserResponse> {
    
    if (!this.runtime) throw new Error("Bridge not initialized. Call init() first.");
    
    this.metrics.increment("bridge.execute.count", 1, {
      method: request.method,
    });
    
    try {
    
      const response = await this.runtime.execute(request);
      
      return response;
    
    } catch (error) {
    
      this.metrics.increment("bridge.execute.error", 1, {
        method: request.method,
      });
    
      throw error;
      
    }
    
  }
  
  on(callback: (data: BrowserResponse) => void): void {
    
    this.eventEmitter.on("onEvent", callback);
    
  }
  
}
