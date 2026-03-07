import { ILogger , ScopedLogger } from "../../../logger";
import { Page } from "puppeteer-core";

export class HostPage {
  private logger: ILogger;
  constructor(
    rootLogger: ILogger,
    private readonly id: string,
    private readonly page: Page
  ) {
    this.logger = new ScopedLogger(rootLogger, "HostPage");
  }

  async injectEnvironmentBuilder(): Promise<void>{
    if (!this.page) {
      throw new Error("Debes inicializar la Page antes de inyectar el entorno.");
    }
    //const 
  }
    
  async evaluate<T>(
    fn: (...args: any[]) => T | Promise<T>,
    ...args: any[]
  ): Promise<T> {
    try {
      return await this.page.evaluate(fn, ...args);
    } catch (error: any) {
      throw new Error(
        `[HostPage][${this.id}] ${error?.message ?? error}`
      );
    }
  }

  async close(): Promise<void> {
    await this.page.close();
  }
}