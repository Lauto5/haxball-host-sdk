import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer"
import { IRuntime } from "./runtime.interface";
import { HostPage } from "../pages/hostPage";
import { ILogger, ScopedLogger } from "../../../logger";

export class Runtime implements IRuntime {

    private logger: ILogger;
    private browser: Browser;
    private pages = new Map<string, HostPage>();

    constructor(browser:Browser , rootLogger:ILogger){
      this.logger = new ScopedLogger(rootLogger,"Runtime");
      this.logger.debug("🛠 Runtime creado con exito.")
      this.browser = browser;
    };

    async launchPage(pageId: string, url:string): Promise<void> {
    if (this.pages.has(pageId)) {
      throw new Error(`Page ${pageId} already exists`);
    }
    this.logger.debug("🛠 Lanzando pagina nueva...")

    const page: Page = await this.browser.newPage();

    this.logger.debug("🛠 pagina nueva lanzada con exito.");

    this.logger.debug("🛠 pagina nueva navegando en url...",{url:url});

    await page.goto(url);

    this.logger.debug("🛠 pagina nueva navegacion correcta.",{url:url});

    const hostPage = new HostPage(pageId, page);

    this.pages.set(pageId, hostPage);
  }

  async closePage(pageId: string): Promise<void> {
    const hostPage = this.pages.get(pageId);
    if (!hostPage) {
      throw new Error(`Page ${pageId} not found`);
    }

    this.logger.debug("🛠 cerrando pagina...",{pageId:pageId});
    await hostPage.close();
    this.pages.delete(pageId);

    this.logger.debug("🛠 pagina cerrada con exito.",{pageId:pageId});

  }

  async evaluate<T>(
    pageId: string,
    fn: (...args: any[]) => T | Promise<T>,
    ...args: any[]
  ): Promise<T> {
    const hostPage = this.pages.get(pageId);
    if (!hostPage) {
      throw new Error(`Page ${pageId} not found`);
    }

    this.logger.debug("🛠 Evaluando Funcion...");

    return hostPage.evaluate(fn, ...args);
  }
    
}