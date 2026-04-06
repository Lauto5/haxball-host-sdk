import { ILogger, ScopedLogger } from "../observability";
import { RuntimeFactory, BrowserResponse , IRuntime , MethodRequest} from "./runtime";
import { RoomConfig, BridgeLaunchConfig } from "../types/haxball";
import { IBridge } from "./bridge.interface";
import { EventEmitter } from "stream";

export class Bridge implements IBridge {

  url: string | undefined;
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
    
    this.runtime.on((data: BrowserResponse) => {
      
      this.eventEmitter.emit("onEvent", data);
      
    });
    
    this.runtime.onHostDeath((pageId: string) => {
      
      this.eventEmitter.emit("onHostDeath",pageId);
      
    })
    
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

    if (this.url === undefined) {
      this.url = url;
    }
    
    await this.runtime.launchPage(this.logger, config.roomName, url, config);

    this.logger.info("Room launched", { roomName: config.roomName });
    
  }
  
  async restartRoom(config: RoomConfig): Promise<void> {
    
    if (!this.runtime || this.url === undefined) throw new Error("Bridge not initialized. Call init() first.");
    
    await this.runtime.closePage(config.roomName);
    
    await this.launchRoom(config, this.url);
    
    this.logger.info('Room restart sucessfully : ', config.roomName);
    
  }

  async closeRoom(id: string): Promise<void> {
    
    await this.runtime!.closePage(id);
    
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
    
    const response:BrowserResponse = await this.runtime.execute(request)
    
    return response;
    
  }
  
  on(callback: (data: BrowserResponse) => void): void {
    
    this.eventEmitter.on("onEvent", callback);
    
  }
  
}
