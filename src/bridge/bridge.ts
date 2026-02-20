import { ILogger, ScopedLogger } from "../logger";
import { BrowserRuntime } from "./browserRuntime"
import { EvaluationContext } from "./evaluationContext";
import { Page } from "puppeteer-core";

export class Bridge {
  private logger: ILogger;
  private browserRuntimer: BrowserRuntime = new BrowserRuntime();
  private evaluationContext: EvaluationContext = new EvaluationContext(this.browserRuntimer);

  constructor(rootLogger: ILogger) {
    this.logger = new ScopedLogger(rootLogger, "Bridge");
  }

  // metodos para probar si funciona( todavia en el desarrollo), luego borrar.
  async launchBrowser(): Promise<void> {
    this.logger.info("Launching browser...");
    await this.browserRuntimer.launch();
    this.logger.info("Browser launched.");
  }

  async launchPage(id: string): Promise<void> {
    this.logger.info(`Launching page with ID: ${id}...`);
    let page: Page =await this.browserRuntimer.launchPage(id);
    this.logger.info(`Page '${id}' launched.`);

    // lanzar pagina de prueba
    await page.goto("https://www.haxball.com");
    const title = await page.title();
    this.logger.info(`Page '${id}' title: ${title}`);
  }

  async evaluateOnPage<T>(pageId: string, fn: (...args: any[]) => T, args: any[] = []): Promise<T> {
    this.logger.info(`Evaluating function on page '${pageId}'...`);
    const result = await this.evaluationContext.evaluate(pageId, fn, args);
    this.logger.info(`Function evaluated on page '${pageId}'.`);
    return result;
  }

  async dispose(): Promise<void> {
    this.logger.info("Disposing browser runtime...");
    await this.browserRuntimer.dispose();
    this.logger.info("Browser runtime disposed.");
  }

}