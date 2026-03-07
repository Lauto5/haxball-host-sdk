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

  async injectEnvironmentBuilder(): Promise<void> {
    if (!this.page) {
      throw new Error("Debes inicializar la Page antes de inyectar el entorno.");
    }
    const environment = new HostEnvironmentBuilder();
   
    this.page.evaluate(environment.build());
    
  }
  
  async launchHost(config: RoomConfig): Promise<void>{
    
    try {
      if (!this.page) {
        throw new Error("Debes inicializar la Page antes de inyectar el entorno.");
      }
      await this.page.evaluate((conf:RoomConfig) => {
        return (window as any).__headless.init(conf);
      },config)
      
    } catch (error: any) {
      throw new Error(
        `[HostPage][${this.id}] ${error?.message ?? error}`
      );
    }
  }
  
  async execute(method: string, args: any[]): Promise<any>{
    
    try {
      if (!this.page) {
        throw new Error("Debes inicializar la Page antes de inyectar el entorno.");
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