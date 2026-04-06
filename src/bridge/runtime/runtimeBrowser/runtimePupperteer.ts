import { Browser , Page} from "puppeteer";
import { IRuntime } from "./runtime.interface";
import { HostPagePuppeteer } from "../pages/hostPagePuppeteer";
import { IHostPage } from "../pages/hostPage.interface";
import { ILogger, ScopedLogger } from "../../../observability";
import { RoomConfig } from "../../../types/haxball";
import { BrowserResponse } from "../responses/browserResponse.interface";
import { MethodRequest } from "../requests/methodRequest.interface";
import { EventEmitter } from "events";


export class RuntimePuppeteer implements IRuntime {
  
  private logger: ILogger;
  
  private browser: Browser;
  
  private pages = new Map<string, IHostPage>();
  
  private eventEmitter: EventEmitter;

  constructor(browser: Browser, rootLogger: ILogger) {
    
    this.logger = new ScopedLogger(rootLogger, "Runtime");
    
    this.browser = browser;
    
    this.eventEmitter = new EventEmitter();
    
  }

  async launchPage(
    rootLogger: ILogger,
    pageId: string,
    url: string,
    config: RoomConfig,
  ): Promise<void> {
    
    if (this.pages.has(pageId)) {
      
      throw new Error(`Page ${pageId} already exists`);
      
    }

    const page: Page = await this.browser.newPage();
    
    const hostPage: IHostPage = new HostPagePuppeteer(rootLogger, pageId, page);
    
    try {
      
      await hostPage.navigate(url);
      
      await hostPage.injectEnvironmentBuilder();
      
      this.suscribeToPageEvents(hostPage);
      
      this.suscribeToPageDeath(hostPage, pageId);
      
      await hostPage.launchHost(config);

      this.pages.set(pageId, hostPage);
      
    } catch (error) {
      
      await page.close().catch(() => { });
      
      this.logger.error("Failed to launch host", error);
      
      process.exit(1);
    }
  }
  
  async execute(request: MethodRequest): Promise<BrowserResponse>{
    
    const hostPage: IHostPage | undefined = this.pages.get(request.id);
    
    if (!hostPage) {
      
      throw new Error(`Page ${request.id} not found`);
      
    }
    
    try {
      
      const result: BrowserResponse = await hostPage.execute(request);
      
      return result;
      
    } catch (error) {
      
      await hostPage.close().catch(() => { });
      
      this.logger.error("Failed to execute method", { id: request.id, method: request.method, args: request.args, error: error });
      
      process.exit(1);
      
    }
    
  }
  
  getUrlHost(pageId: string): string {
    
    const hostPage: IHostPage | undefined = this.pages.get(pageId);
    
    if (!hostPage) {
      
      throw new Error(`Page ${pageId} not found`);
      
    }
    
    return hostPage.getUrlHost();
    
  }
  
  onHostDeath(callback: (pageId: string) => void): void {
    
    this.eventEmitter.on("onHostDeath", callback);
    
  }
  

  on(callback:(data: BrowserResponse) => void): void{
    
    this.eventEmitter.on("onEmit", callback);
    
  }

  async closePage(pageId: string): Promise<void> {
    
    const hostPage: IHostPage | undefined = this.pages.get(pageId);
    
    if (!hostPage) {
      
      throw new Error(`Page ${pageId} not found`);
      
    }
    
    try { 
      
      await hostPage.close();
      
      this.pages.delete(pageId);
      
    } catch (error) {
      
      this.logger.error("Failed to closed page", { id: pageId, error: error });
      
      throw error;
      
    }
  }
  
  async close(): Promise<void> {
    
    this.pages.forEach(async (hostPage) => {
      
      await hostPage.close().catch(() => { });
      
    });
    
    this.pages.clear();
    
    this.browser.close().catch(() => { });
    
    this.logger.debug("Runtime closed");
    
  }
  
  private suscribeToPageEvents(hostPage: IHostPage): void {
    
    hostPage.on((data: BrowserResponse) => {
      
      this.eventEmitter.emit("onEmit", data);
      
    });
    
  }
  
  private suscribeToPageDeath(hostPage: IHostPage, pageId: string): void {
    
    hostPage.onHostDeath(() => {
      
      this.eventEmitter.emit("onHostDeath", pageId);
      
    });
    
  }
  
}
