import { Browser , Page} from "puppeteer";
import { IRuntime } from "./runtime.interface";
import { HostPagePuppeteer } from "../pages/hostPagePuppeteer";
import { IHostPage } from "../pages/hostPage.interface";
import { ILogger, IMetrics, ITrace, Observability } from "../../../observability";
import { RoomConfig } from "../../../../types/haxball";
import { BrowserResponse } from "../responses/browserResponse.interface";
import { MethodRequest } from "../requests/methodRequest.interface";
import { EventEmitter } from "events";


export class RuntimePuppeteer implements IRuntime {
  
  private logger: ILogger;
  
  private metrics: IMetrics;
  
  private browser: Browser;
  
  private pages = new Map<string, IHostPage>();
  
  private eventEmitter: EventEmitter;

  constructor(browser: Browser, obs: Observability) {
    
    this.logger = obs.createScopeLogger("Runtime");
    
    this.metrics = obs.createScopeMetrics({ runtime: "puppeteer" });
    
    this.browser = browser;
    
    this.eventEmitter = new EventEmitter();
    
  }

  async launchPage(
    obs: Observability,
    pageId: string,
    url: string,
    config: RoomConfig,
    trace: ITrace,
  ): Promise<void> {
    
    if (this.pages.has(pageId)) {
      
      throw new Error(`Page ${pageId} already exists`);
      
    }
    
    const span = trace.startSpan("runtime.launchPage");
    
    const start = Date.now();
    
    this.metrics.increment("runtime.page.launch");
    
    const page: Page = await this.browser.newPage();
    
    try {
    
      const hostPage: IHostPage = new HostPagePuppeteer(obs, pageId, page);
    
      await hostPage.navigate(url);
      await hostPage.injectEnvironmentBuilder();
    
      this.suscribeToPageEvents(hostPage);
      this.suscribeToPageDeath(hostPage, pageId);
    
      await hostPage.launchHost(config, trace);
    
      this.pages.set(pageId, hostPage);
    
      this.metrics.gauge("runtime.page.count", this.pages.size);
    
    } catch (error) {
    
      this.metrics.increment("runtime.page.launch.error");
    
      await page.close().catch(() => { });
    
      this.logger.error("Failed to launch host", error);
    
      process.exit(1);
    
    } finally {
    
      const duration = Date.now() - start;
      
      this.metrics.observe("runtime.page.launch.duration", duration);
      
      span.end();
    
    }
  }
  
  async execute(request: MethodRequest, trace: ITrace): Promise<BrowserResponse>{
    
    const hostPage: IHostPage | undefined = this.pages.get(request.id);
    
    if (!hostPage) {
      
      throw new Error(`Page ${request.id} not found`);
      
    }
    
    const span = trace.startSpan("runtime.execute");
    
    const start = Date.now();
    
    this.metrics.increment("runtime.execute.count");
    
    try {
    
      const result: BrowserResponse = await hostPage.execute(request, trace);
    
      return result;
    
    } catch (error) {
    
      this.metrics.increment("runtime.execute.error");
    
      await hostPage.close().catch(() => { });
    
      this.logger.error("Failed to execute method", {
        id: request.id,
        method: request.method,
        args: request.args,
        error: error,
      });
    
      process.exit(1);
    
    } finally {
    
      const duration = Date.now() - start;
    
      this.metrics.observe("runtime.execute.duration", duration, {
        method: request.method,
      });
      
      span.end();
    
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

  async closePage(pageId: string , trace: ITrace): Promise<void> {
    
    const hostPage: IHostPage | undefined = this.pages.get(pageId);
    
    if (!hostPage) {
      
      throw new Error(`Page ${pageId} not found`);
      
    }
    
    const span = trace.startSpan("runtime.closePage");
    
    try { 
      
      this.metrics.increment("runtime.page.close");
      
      await hostPage.close();
      
      this.pages.delete(pageId);
      
      this.metrics.gauge("runtime.page.count", this.pages.size);
      
    } catch (error) {
      
      this.logger.error("Failed to closed page", { id: pageId, error: error });
      
      this.metrics.increment("runtime.page.close.error");
      
      throw error;
      
    } finally {
      
      span.end();
      
    }
  }
  
  async close(trace: ITrace): Promise<void> {
    
    const span = trace.startSpan("runtime.close");
    
    try {
      
      this.metrics.increment("runtime.close");
      
      this.pages.forEach(async (hostPage) => {
        await hostPage.close().catch(() => {});
      });
      
      this.pages.clear();
      
      this.metrics.gauge("runtime.page.count", 0);
      
      this.browser.close().catch(() => {});
      
    } catch (error) {
      
      this.logger.error("Failed to close runtime", { error: error });
      
      this.metrics.increment("runtime.close.error");
      
      throw error;
      
    } finally {
      
      span.end();
      
    }
  }
  
  private suscribeToPageEvents(hostPage: IHostPage): void {
    
    hostPage.on((data: BrowserResponse) => {
      
      this.eventEmitter.emit("onEmit", data);
      
    });
    
  }
  
  private suscribeToPageDeath(hostPage: IHostPage, pageId: string): void {
    
    hostPage.onHostDeath(() => {
    
      this.metrics.increment("runtime.page.death");
    
      this.pages.delete(pageId);
    
      this.metrics.gauge("runtime.page.count", this.pages.size);
    
      this.eventEmitter.emit("onHostDeath", pageId);
    
    });
    
  }
  
}
