import { ILogger , ScopedLogger } from "../../../logger";
import { Page } from "puppeteer-core";
import { HostEnvironmentBuilder } from "../APIInjector/hostEnvironmentBuilder";
import { IHostPage } from "./hostPage.interface";
import { RoomConfig } from "../../../types/haxball";

export class HostPage implements IHostPage {
  private logger: ILogger;
  constructor(
    rootLogger: ILogger,
    private readonly id: string,
    private readonly page: Page
  ) {
    this.logger = new ScopedLogger(rootLogger, "HostPage");
  }
  
  async navigate(url: string): Promise<void>{
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    
    this.logger.debug("Page navigating to ", { url: url , pageId: this.id});
    
    await this.page.goto(url);
    await this.page.waitForFunction(() => typeof (window as any).HBInit === "function");
    
    this.logger.debug("Page navigation to url completed successfully", {url: url , pageId: this.id});
    
  }

  async injectEnvironmentBuilder(): Promise<void> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    const environment = new HostEnvironmentBuilder();
   
    this.logger.debug("Injecting environment into page",{pageId: this.id});
    
    this.page.evaluate(environment.build());
    await this.page.waitForFunction(() => (window as any).__headless !== undefined);
    
    this.logger.debug("Environment injection into page completed successfully ",{pageId: this.id});
    
    this.connectLoger();
    
  }
  
  async launchHost(config: RoomConfig): Promise<void>{
    
    try {
      if (!this.page) {
        throw new Error("Page not initialized");
      }
      
      this.logger.debug("Launching host",{pageId: this.id});
      
      await this.page.evaluate((conf:RoomConfig) => {
        (window as any).__headless.init(conf);
      }, config)
      
      this.logger.debug("Host launch completed successfully",{pageId: this.id});
      
    } catch (error: any) {
      throw new Error(
        `[HostPage][${this.id}] ${error?.message ?? error}`
      );
    }
  }
  
  async execute(method: string, args: any[]): Promise<any>{
    
    try {
      if (!this.page) {
        throw new Error("Page not initialized");
      }
      const result = await this.page.evaluate((method:string, args: any[]) => {
        return (window as any).__headless.exec(method, args);
      }, method, args)
      
      return result;  
    } catch (error: any) {
      throw new Error(
        `[HostPage][${this.id}] ${error?.message ?? error}`
      );
    }
  }

  async close(): Promise<void> {
    this.logger.debug("closing page",{pageId: this.id});
    await this.page.close();
    this.logger.debug("page closed completed successfully",{pageId: this.id});
  }
  
  private connectLoger(): void{
    this.page.on("console", msg => this.logger.info("", msg.text()));
  }
}