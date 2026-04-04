import { RuntimePuppeteer } from "../runtimeBrowser/runtimePupperteer";
import { ILogger, ScopedLogger } from "../../../logger"
import { puppeteerBrowser } from "../browser/puppeteerBrowser"
import { BrowserConfigPuppeteer, chooseBrowserConfig } from "../browser/config/browseConfigPuppeteer.interface"
import { IRuntime } from "../runtimeBrowser/runtime.interface";
import { BridgeLaunchConfig } from "../../../types/haxball";
import { Browser } from "puppeteer";


export class RuntimeFactory {
  
  async getRuntime(rootLogger: ILogger, bridgeLaunchConfig: BridgeLaunchConfig): Promise<IRuntime> {
    
    const logger = new ScopedLogger(rootLogger, "Runtime-Factory");
    
    if (bridgeLaunchConfig.runtime === 'puppeteer') {
      
      logger.info("Getting Puppeteer runtime");
      
      return await this.getRuntimePuppeteer(rootLogger, bridgeLaunchConfig);
      
    }
    
    throw new Error(`Unsupported runtime: ${bridgeLaunchConfig.runtime}`);
    
  }
  
  async getRuntimePuppeteer(rootLogger: ILogger, bridgeLaunchConfig: BridgeLaunchConfig): Promise<IRuntime> {
    
    const browserConfig: BrowserConfigPuppeteer = chooseBrowserConfig(bridgeLaunchConfig.system, bridgeLaunchConfig.executablePath);
    
    const browser:Browser = await puppeteerBrowser(browserConfig);
    
    return new RuntimePuppeteer(browser, rootLogger);
    
  }
  
}