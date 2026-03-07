import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer";
import { IRuntime } from "./runtime.interface";
import { HostPage } from "../pages/hostPage";
import { ILogger, ScopedLogger } from "../../../logger";
import { BrowserEnvironmentBuilder } from "../APIInjector/browserEnvironmentBuilder";
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
        
        /* 
        await page.evaluate(() => {
            (window as any).HBInit({
                roomName: "NODEJS",
                playerName:"hoosts",
                maxPlayers: 12,
                public:true,
                noPlayer: true,
                token:"thr1.AAAAAGmsEHRtVD_n8qcq_g.5BbjMIQzk6Q"
            });
        });
        */
        
    }

    async launchPage(
        pageId: string,
        url: string,
        config:RoomConfig,
    ): Promise<void> {
        if (this.pages.has(pageId)) {
            throw new Error(`Page ${pageId} already exists`);
        }
        this.logger.debug("🛠 Lanzando pagina nueva...");

        const page: Page = await this.browser.newPage();

        this.logger.debug("🛠 pagina nueva lanzada con exito.");

        this.logger.debug("🛠 pagina nueva navegando en url...", { url: url });
        
        await page.goto(url);
        
        await page.waitForFunction(()=> typeof (window as any).HBInit ==="function");

        const com1 = await page.evaluate(() => typeof (window as any).HBInit === "function");
        
        this.logger.debug("🛠 existe hbinit?...", { result:com1 });
        
        const environment = new BrowserEnvironmentBuilder();

        await page.evaluate(environment.build());
        
        await page.waitForFunction(() => (window as any).__hb__runtime !== undefined);
        
        const com2 = await page.evaluate(() => (window as any).__hb__runtime !== undefined);
        
        this.logger.debug("🛠 existe el entorno?...", { result:com2 });

        const hostPage = new HostPage(pageId, page);
        
        page.on("console", msg => this.logger.debug("MENSAJE DEL BROW :", msg.text()));

        await page.evaluate((config) => (window as any).__hb__runtime.init(config), config);
        
        const com3 = await page.evaluate(() => (window as any).__hb__runtime.room !== null);
        
        this.logger.debug("🛠 existe el room?...", { result: com3 });

        this.pages.set(pageId, hostPage);
        
        this.logger.debug("🛠 pagina nueva navegacion correcta.", { url: url });
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
