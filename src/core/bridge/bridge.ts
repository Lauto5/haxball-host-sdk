import { ILogger, IMetrics, ITracer , Observability} from "../observability";
import { RuntimeFactory, BrowserResponse , IRuntime , MethodRequest} from "./runtime";
import { RoomConfig, BridgeLaunchConfig } from "../types/haxball";
import { IBridge } from "./bridge.interface";
import { EventEmitter } from "stream";

export class Bridge implements IBridge {

  private url: string | undefined;
  private logger: ILogger;
  private metrics: IMetrics;
  private tracer: ITracer;
  private runtime?: IRuntime;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor(obs: Observability) {
    
    this.logger = obs.createScopeLogger("Bridge");
    
    this.metrics = obs.createScopeMetrics({ layer: "bridge" });
    
    this.tracer = obs.getTracer();
    
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
    
    const trace = this.tracer.startTrace("bridge.close");
    
    const span = trace.startSpan("bridge.close");
    try {
      if (this.runtime) {
        
        await this.runtime.close(trace);
        
      }
    } catch (err) {
      
      this.logger.error("Error to close bridge", err);
      
    } finally {
      
      this.logger.debug("Bridge closed");
      
      span.end();
      
    }
    
  }

  // =========================
  // ROOM MANAGEMENT
  // =========================

  async launchRoom(obs: Observability, config: RoomConfig, url: string): Promise<void> {
    
    if (!this.runtime) throw new Error("Bridge not initialized. Call init() first.");

    const trace = this.tracer.startTrace("bridge.launchRoom");
    
    const span = trace.startSpan("bridge.launchRoom");

    if (this.url === undefined) {
      this.url = url;
    }

    try {

      await this.runtime.launchPage(obs, config.roomName, url, config , trace);

      this.metrics.increment("bridge.room.launch");

      this.logger.info("Room launched", {
        traceId: trace.traceId,
        roomName: config.roomName,
      });

    } catch (error) {

      this.logger.error("Room launch failed", {
        traceId: trace.traceId,
        roomName: config.roomName,
        error,
      });

      throw error;

    } finally {

      span.end();

    }
  }
  
  async restartRoom(obs: Observability, config: RoomConfig): Promise<void> {

    if (!this.runtime || this.url === undefined) throw new Error("Bridge not initialized.");

    const trace = this.tracer.startTrace("bridge.restartRoom");
    const span = trace.startSpan("bridge.restartRoom");

    try {

      await this.runtime.closePage(config.roomName, trace);

      await this.launchRoom(obs, config, this.url);

      this.metrics.increment("bridge.room.restart");

      this.logger.info("Room restarted", {
        traceId: trace.traceId,
        roomName: config.roomName,
      });

    } finally {

      span.end();

    }
  }

  async closeRoom(id: string): Promise<void> {

    const trace = this.tracer.startTrace("bridge.closeRoom");
    
    const span = trace.startSpan("bridge.closeRoom");

    try {

      await this.runtime!.closePage(id, trace);

      this.metrics.increment("bridge.room.close");

      this.logger.info("Room closed", {
        traceId: trace.traceId,
        roomId: id,
      });

    } finally {

      span.end();

    }
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
    
    const trace = this.tracer.startTrace("bridge.execute");
    
    const span = trace.startSpan("bridge.execute");
    
    this.metrics.increment("bridge.execute.count", 1, {
      method: request.method,
    });
    
    try {
    
      const response = await this.runtime.execute(request , trace);
      
      return response;
    
    } catch (error) {
    
      this.metrics.increment("bridge.execute.error", 1, {
        method: request.method,
      });
    
      throw error;
      
    } finally {
      
      span.end();
      
    }
    
  }
  
  on(callback: (data: BrowserResponse) => void): void {
    
    this.eventEmitter.on("onEvent", callback);
    
  }
  
}
