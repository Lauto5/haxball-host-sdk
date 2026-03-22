import { RuntimePuppeteer } from "../runtimeBrowser/runtimePupperteer";
import { ILogger } from "../../../logger"
import { puppeteerBrowser } from "../browser/puppeteerBrowser"
import { BrowserConfigPuppeteer, chooseBrowserConfig } from "../browser/config/browseConfigPuppeteer.interface"
import { IRuntime } from "../runtimeBrowser/runtime.interface";

export class RuntimeFactory {
  
  async getRuntimePuppeteer(rootLogger: ILogger, system: 'linux' | 'windows' | 'mac' | 'unknown', executablePath?: string): Promise<IRuntime> {
    
    const browserConfig: BrowserConfigPuppeteer = chooseBrowserConfig(system, executablePath);
    
    const browser = await puppeteerBrowser(browserConfig);
    
    return new RuntimePuppeteer(browser, rootLogger);
    
  }
  
}