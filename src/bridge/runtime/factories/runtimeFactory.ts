import { RuntimePuppeteer } from "../runtimeBrowser/runtimePupperteer";
import { ILogger } from "../../../logger"
import { puppeteerBrowser } from "../browser/puppeteerBrowser"
import { BrowserConfigPuppeteer, chooseBrowserConfig } from "../browser/config/browseConfigPuppeteer.interface"
import { IRuntime } from "../runtimeBrowser/runtime.interface";
import { BridgeLaunchConfig } from "../../../types/haxball";
import { Browser } from "puppeteer";


export class RuntimeFactory {
  
  async getRuntime(rootLogger: ILogger, bridgeLaunchConfig: BridgeLaunchConfig): Promise<IRuntime> {
    
    if (bridgeLaunchConfig.runtime === 'puppeteer') {
      
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