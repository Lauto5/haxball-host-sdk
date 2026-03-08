import { ILogger, ScopedLogger } from "../../../logger";
import { Page } from "puppeteer-core";
import { HostEnvironmentBuilder } from "../APIInjector/hostEnvironmentBuilder";
import { IHostPage } from "./hostPage.interface";
import { RoomConfig } from "../../../types/haxball";

export class HostPage implements IHostPage {
  private logger: ILogger;
  constructor(
    rootLogger: ILogger,
    private readonly id: string,
    private readonly page: Page,
  ) {
    this.logger = new ScopedLogger(rootLogger, "HostPage");
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
    
    this.emitEvent();
  }

  async launchHost(config: RoomConfig): Promise<void> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }

    this.logger.debug("Launching host", { pageId: this.id });

    const response = await this.page.evaluate((conf: RoomConfig) => {
      const result = (window as any).__headless.init(conf);
      return result;
      
    }, config);
    
    if (!response.success) {
      throw new Error("Token is invalid");
    }
    
    this.logger.debug("room initialized ", { room: config.roomName });
    
    await this.page.evaluate(() => {
      (window as any).__headless.subscribeEvents();
    });

    this.logger.debug("Host launch completed successfully", {
      pageId: this.id,
    });
  }

  async execute(method: string, args: any[]): Promise<any> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    const result = await this.page.evaluate(
      (method: string, args: any[]) => {
        return (window as any).__headless.exec(method, args);
      },
      method,
      args,
    );

    return result;
  }

  async close(): Promise<void> {
    this.logger.debug("closing page", { pageId: this.id });
    await this.page.close();
    this.logger.debug("page closed completed successfully", {
      pageId: this.id,
    });
  }
  
  private async emitEvent(): Promise<void> {
    await this.page.exposeFunction("emit" ,(evenData:any)=>{this.logger.info("esto me llego: ",evenData)});
  }

  private connectLogger(): void {
    this.page.on("console", (msg) => this.logger.info("", msg.text()));
  }
  
}
