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
    try {
      if (this.pages.has(pageId)) {
        throw new Error(`Page ${pageId} already exists`);
      }

      const page = await this.browser.newPage();

      const hostPage: HostPage = new HostPage(rootLogger, pageId, page);

      await hostPage.navigate(url);

      await hostPage.injectEnvironmentBuilder();

      await hostPage.launchHost(config);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error("", { error: error.name, message: error.message });
      }
    }
  }

  async closePage(pageId: string): Promise<void> {
    try {
      const hostPage = this.pages.get(pageId);
      if (!hostPage) {
        throw new Error(`Page ${pageId} not found`);
      }
      await hostPage.close();
      this.pages.delete(pageId);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error("", { error: error.name, message: error.message });
      }
    }
  }
}
