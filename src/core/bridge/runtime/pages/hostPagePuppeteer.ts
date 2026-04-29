import { ILogger, Observability , IMetrics, ITrace, ITracer } from "../../../observability";
import { Page } from "puppeteer-core";
import { HostEnvironmentBuilder } from "../APIInjector/hostEnvironmentBuilder";
import { IHostPage } from "./hostPage.interface";
import { RoomConfig } from "../../../domain";
import { BrowserResponse } from "../responses/browserResponse.interface";
import { LiveRoomResponse } from "../responses/liveRoomResponse.interface";
import { ErrorResponse } from "../responses/errorResponse.interface";
import { EventEmitter } from "events";
import { HostInitResponse } from "../responses/hostInitResponse.interface";
import { MethodRequest } from "../requests/methodRequest.interface";
import { SimpleRequestQueue } from "./requestProcess/simpleRequestProcess";
import { IRequestProcess } from "./requestProcess/requestProcess.interface";


export class HostPagePuppeteer implements IHostPage {
  
  urlHost: string | undefined;
  
  isActive: boolean = false;
  
  requestProcess: IRequestProcess;
  
  private logger: ILogger;
  
  private metrics?: IMetrics;
  
  private tracer: ITracer;
  
  private eventEmitter: EventEmitter;
  
  constructor(
    obs : Observability,
    private readonly id: string,
    private readonly page: Page,
  ) {
    
    this.eventEmitter = new EventEmitter();
    
    this.logger = obs.createScopeLogger("HostPage");
    
    if(obs.isMetricsEnabled()) {
      this.metrics = obs.createScopeMetrics({ hostPageId: this.id });
    }
    
    this.tracer = obs.getTracer();
    
    this.requestProcess = new SimpleRequestQueue(obs);
    
    setInterval(() => {
      
      if (!this.page || !this.isActive) {
        return;
      }
      
      this.handleAlive();
      
    }, 6000);
    
    
  }

  async navigate(url: string): Promise<void> {
    
    if (!this.page) {
      
      throw new Error("Page not initialized");
      
    }
    
    const start = Date.now();

    await this.page.goto(url);
    
    await this.page.waitForFunction(
    
      () => typeof (window as any).HBInit === "function",
      
    );
    
    const duration = Date.now() - start;
    
    this.metrics?.observe("host.navigate.duration", duration);
    
  }

  async injectEnvironmentBuilder(): Promise<void> {
    
    if (!this.page) {
      
      throw new Error("Page not initialized");
      
    }

    const start = Date.now();
    
    const environment = new HostEnvironmentBuilder();

    await this.page.evaluate(environment.build());
    
    await this.page.waitForFunction(
    
      () => (window as any).__headless !== undefined,
      
    );

    this.connectLogger();

    this.environmentReceive();
    
    const duration = Date.now() - start;
    
    this.metrics?.observe("host.inject.duration", duration);
    
  }

  async launchHost(config: RoomConfig, trace: ITrace): Promise<void> {
    
    if (!this.page) {
      
      throw new Error("Page not initialized");
      
    }
    
    const span = trace.startSpan("host.launch");
    
    const start = Date.now();
    
    try {
      
      const response: HostInitResponse = await this.page.evaluate((config: RoomConfig) => {
        
        const result = (window as any).__headless.init(config);
        
        return result;
        
      }, config);
  
      if (!response.success) {
        
        throw new Error(`Room: ${config.roomName}, ${response.message}`)
        
      }
      
      await this.page.evaluate(() => {
        
        (window as any).__headless.subscribeEvents();
        
      });
      
      this.urlHost = response.data;
      
      this.isActive = true;
      
    } catch (error) {
      
      throw error;
      
    } finally {
      
      const duration = Date.now() - start;
      
      this.metrics?.observe("host.launch.duration", duration);
      
      span.end();
      
    }
  }

  async execute(request: MethodRequest, trace: ITrace): Promise<BrowserResponse> {
    if (!this.page) throw new Error("Page not initialized");
    if (!this.isActive) throw new Error("Host is not active");
    
    return this.requestProcess.add(async () => {
    
      const span = trace.startSpan("host.execute");
      
      const start = Date.now();
    
      try {
    
        this.metrics?.increment("host.execute.count", 1, {
          method: request.method,
        });
    
        const result = await this.page.evaluate(
          (method: string, args: any[]) => {
            return (window as any).__headless.exec(method, args);
          },
          request.method,
          request.args
        );
    
        return {
          id: this.id,
          method: request.method,
          response: result,
        };
    
      } catch (err) {
        
        this.metrics?.increment("host.execute.error", 1, {
          method: request.method,
        });
    
        throw err;
    
      } finally {
    
        const duration = Date.now() - start;
    
        this.metrics?.observe("host.execute.duration", duration, {
          method: request.method,
        });
        
        span.end();
    
      }
    }, trace);
  }

  async close(): Promise<void> {
    
    const trace = this.tracer.startTrace("host.close");
    
    const span = trace.startSpan("host.close");
    
    await this.page.close();
    
    this.isActive = false;
    
    this.eventEmitter.removeAllListeners("onEmit");
    
    this.metrics?.increment("host.close");
    
    span.end();
    
  }

  on(callback: (data: BrowserResponse) => void): void {
    
    this.eventEmitter.on("onEmit", callback);
    
  }
  
  private async environmentReceive(): Promise<void> {
    
    await this.page.exposeFunction(
      
      "emit",
      
      (browserReponse: BrowserResponse) => {

        const eventResponse: BrowserResponse = {
          id: this.id,
          method: browserReponse.method,
          response: browserReponse.response,
        };
        
        if (browserReponse.method !== "onGameTick") {
          this.metrics?.increment("host.event.received", 1, {
            method: browserReponse.method,
          });
        }
        
        this.eventEmitter.emit("onEmit", eventResponse);
        
      },
    );
    
  }
  
  getUrlHost(): string {
    
    if (this.urlHost) {
      
      return this.urlHost;
    
    }
    
    throw new Error("urlHost is not defined");
    
  }
  
  onHostDeath(callback: (pageId: string) => void): void {
    
    this.eventEmitter.on("onDeath", callback);
    
  }
  
  async handleAlive(): Promise<void> {
    
    try {
      
      const isAlive: ErrorResponse | LiveRoomResponse = await this.isAlive();
      
      this.metrics?.gauge("host.alive", isAlive ? 1 : 0);
      
      if ("error" in isAlive) {
        
        this.isActive = false;
        
        this.logger.warn("Host is dead, closing page : ", {id: this.id, error: isAlive.error, theLastStatus: isAlive.theLastStatus });
        
        await this.close();
        
        this.eventEmitter.emit("onDeath", this.id);
        
      }
      
    } catch (error) {
      
      this.logger.error("Error while checking host alive : ", error);
      
    }
    
  }
  
  async isAlive(): Promise<ErrorResponse | LiveRoomResponse> {
    
    if (!this.page) {
      
      throw new Error("Page not initialized");
      
    }
    
    const response: ErrorResponse | LiveRoomResponse = await this.page.evaluate(() => {
      
      const isAlive: ErrorResponse | LiveRoomResponse = (window as any).__headless.isAlive();
      
      return isAlive;
      
    });
    
    return response;

  }

  private connectLogger(): void {
    
    this.page.on("console", (msg) => this.logger.debug("", msg.text()));
    
  }
  
}
