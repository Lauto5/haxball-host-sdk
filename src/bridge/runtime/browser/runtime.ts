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
    
    // entoces si funciona, pero debemos buscar como sitematizar el entorno de adentro.
  /*
  async testLaunchPAge() {
        const page: Page = await this.browser.newPage();
        await page.goto("https://www.haxball.com/headless");
        await page.waitForFunction(() => typeof (window as any).HBInit === "function");
        
        const environment = new BrowserEnvironmentBuilder();
        
        await page.evaluate(environment.build());
        
        await page.waitForFunction(() => (window as any).__hb__runtime !== undefined);
        
        page.on("console", msg => this.logger.debug("MENSAJE DEL BROW :", msg.text()));
        
        await page.evaluate(() => {
            console.log(typeof (window as any).__hb__runtime.init !== undefined);
            console.log((window as any).__hb__runtime);
            (window as any).__hb__runtime.saludar();
            (window as any).__hb__runtime.init({
                roomName: "NODEJS",
                playerName:"hoosts",
                maxPlayers: 12,
                public:true,
                noPlayer: true,
                token:"thr1.AAAAAGmsRl28qo3_oxw2_g.YkAP63O89bM"
            });
        })
        
    }
*/
    
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
