import { ILogger, ScopedLogger } from "../../../logger";
import { Page } from "puppeteer-core";
import { HostEnvironmentBuilder } from "../APIInjector/hostEnvironmentBuilder";
import { IHostPage } from "./hostPage.interface";
import { RoomConfig } from "../../../types/haxball";
import { BrowserResponse } from "../responses/browserResponse.interface";
import { EventEmitter } from "events";
import { HostInitResponse } from "../responses/hostInitResponse.interface";
import { MethodRequest } from "../requests/methodRequest.interface";


export class HostPagePuppeteer implements IHostPage {
  
  urlHost: string | undefined;
  
  isActive: boolean = false;
  
  private logger: ILogger;
  
  private eventEmitter: EventEmitter;
  
  constructor(
    rootLogger: ILogger,
    private readonly id: string,
    private readonly page: Page,
  ) {
    
    this.eventEmitter = new EventEmitter();
    
    this.logger = new ScopedLogger(rootLogger, "HostPage");
    
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

    this.logger.debug("Page navigating to ", { url: url, pageId: this.id });

    await this.page.goto(url);
    
    await this.page.waitForFunction(
    
      () => typeof (window as any).HBInit === "function",
      
    );

    this.logger.debug("Page navigation completed", {
      url: url,
      pageId: this.id,
    });
    
  }

  async injectEnvironmentBuilder(): Promise<void> {
    
    if (!this.page) {
      
      throw new Error("Page not initialized");
      
    }

    const environment = new HostEnvironmentBuilder();

    this.logger.debug("Injecting environment into page", { pageId: this.id });

    await this.page.evaluate(environment.build());
    
    await this.page.waitForFunction(
    
      () => (window as any).__headless !== undefined,
      
    );

    this.logger.debug("Environment injection completed", { pageId: this.id });

    this.connectLogger();

    this.environmentReceive();
  }

  async launchHost(config: RoomConfig): Promise<void> {
    
    if (!this.page) {
      
      throw new Error("Page not initialized");
      
    }

    this.logger.debug("Launching host", { pageId: this.id });

    const response: HostInitResponse = await this.page.evaluate((config: RoomConfig) => {
      
      const result = (window as any).__headless.init(config);
      
      return result;
      
    }, config);

    if (!response.success) {
      
      throw new Error(`Room: ${config.roomName}, ${response.message}`)
      
    }
    

    this.logger.debug(response.message, { room: config.roomName, link: response.data });

    
    await this.page.evaluate(() => {
      
      (window as any).__headless.subscribeEvents();
      
    });
    
    this.urlHost = response.data;
    
    this.isActive = true;

    this.logger.debug("Host launch completed successfully", {
      pageId: this.id,
    });
    
  }

  async execute(request: MethodRequest): Promise<BrowserResponse> {
    
    if (!this.page) {
      
      throw new Error("Page not initialized");
      
    }
    
    this.logger.debug("Execute method..", { id: this.id, method: request.method, args: request.args });
    
    const result = await this.page.evaluate(
    
      (method: string, args: any[]) => {
        
        return (window as any).__headless.exec(method, args);
        
      },
      request.method,
      request.args,
    );
    
    const response: BrowserResponse = {
      id: this.id,
      method: request.method,
      response: result,
    };

    return response;
    
  }

  async close(): Promise<void> {
    
    this.logger.debug("closing page", { pageId: this.id });
    
    await this.page.close();
    
    this.logger.debug("page closed completed successfully", {
      pageId: this.id,
    });
    
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

        //this.logger.debug("environment received:", {id:eventResponse.id, method:eventResponse.method});
        
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
    
    const isAlive = await this.isAlive();
    
    if (!isAlive) {
      
      this.isActive = false;
      
      this.logger.warn("Host is dead, closing page : ", this.id);
      
      this.close();
      
      this.eventEmitter.emit("onDeath", this.id);
      
    }
    
  }
  
  async isAlive(): Promise<boolean> {
    
    if (!this.page) {
      
      throw new Error("Page not initialized");
      
    }
    
    return this.page.evaluate(() => {
      
      if (!navigator.onLine) {
        
        return false;
        
      }
      
      return (window as any).__headless.isAlive();
      
    });
    
  }

  private connectLogger(): void {
    
    this.page.on("console", (msg) => this.logger.debug("", msg.text()));
    
  }
  
}
