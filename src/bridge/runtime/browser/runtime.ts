import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer";
import { IRuntime } from "./runtime.interface";
import { HostPage } from "../pages/hostPage";
import { ILogger, ScopedLogger } from "../../../logger";
import { RoomConfig } from "../../../types/haxball";

export class Runtime implements IRuntime {
  private logger: ILogger;
  private browser: Browser;
  private pages = new Map<string, HostPage>();

  constructor(browser: Browser, rootLogger: ILogger) {
    this.logger = new ScopedLogger(rootLogger, "Runtime");
    this.browser = browser;
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

    const page = await this.browser.newPage();
    const hostPage = new HostPage(rootLogger, pageId, page);

    try {
      await hostPage.navigate(url);
      await hostPage.injectEnvironmentBuilder();
      await hostPage.launchHost(config);

      this.pages.set(pageId, hostPage);
    } catch (error) {
      await page.close().catch(() => {});
      this.logger.error("Failed to launch page");
      throw error;
    }
  }
  
  async execute(pageId: string, method: string, args: any[]): Promise<any>{
    const hostPage = this.pages.get(pageId);
    if (!hostPage) {
      throw new Error(`Page ${pageId} not found`);
    }
    try {
      let result = await hostPage.execute(method, args);
      return result;
    } catch (error) {
      await hostPage.close().catch(() => {});
      this.logger.error("Failed to execute method");
      throw error;
    }
  }

  async closePage(pageId: string): Promise<void> {
    const hostPage = this.pages.get(pageId);
    if (!hostPage) {
      throw new Error(`Page ${pageId} not found`);
    }
    
    try { 
      await hostPage.close();
      this.pages.delete(pageId);
    } catch (error) {
      this.logger.error("Failed to closed page");
      throw error;
    }
  }
}
