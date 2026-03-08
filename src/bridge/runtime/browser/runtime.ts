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
        this.logger.debug("🛠 Runtime creado con exito.");
        this.browser = browser;
    }
    
  async launchPage(
        rootLogger:ILogger,
        pageId: string,
        url: string,
        config:RoomConfig,
    ): Promise<void> {
        if (this.pages.has(pageId)) {
            throw new Error(`Page ${pageId} already exists`);
        }
      
      const page = await this.browser.newPage();
      
      const hostPage: HostPage = new HostPage(rootLogger, pageId, page);
    
      await hostPage.navigate(url);
    
      await hostPage.injectEnvironmentBuilder();
    
      await hostPage.launchHost(config);
    
      this.logger.debug("SE LANZO LA PAGINA");
    }

    async closePage(pageId: string): Promise<void> {
        const hostPage = this.pages.get(pageId);
        if (!hostPage) {
            throw new Error(`Page ${pageId} not found`);
        }

        this.logger.debug("🛠 cerrando pagina...", { pageId: pageId });
        await hostPage.close();
        this.pages.delete(pageId);

        this.logger.debug("🛠 pagina cerrada con exito.", { pageId: pageId });
    }
}
