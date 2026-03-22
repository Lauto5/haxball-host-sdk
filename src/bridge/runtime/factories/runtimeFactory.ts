import { RuntimePuppeteer } from "../runtimeBrowser/runtimePupperteer";
import { ILogger } from "../../../logger"
import { puppeteerBrowser } from "../browser/puppeteerBrowser"
import { BrowserConfigPuppeteer, chooseBrowserConfig } from "../browser/config/browseConfigPuppeteer.interface"
import { IRuntime } from "../runtimeBrowser/runtime.interface";
import { BridgeLaunchConfig } from "../../../types/haxball";


export class RuntimeFactory {
  
  async getRuntimePuppeteer(rootLogger: ILogger, bridgeLaunchConfig: BridgeLaunchConfig): Promise<IRuntime> {
    
    const browserConfig: BrowserConfigPuppeteer = chooseBrowserConfig(bridgeLaunchConfig.system, bridgeLaunchConfig.executablePath);
    
    const browser = await puppeteerBrowser(browserConfig);
    
    return new RuntimePuppeteer(browser, rootLogger);
    
  }
  
}