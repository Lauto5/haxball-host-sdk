import { RuntimePuppeteer } from "../runtimeBrowser/runtimePupperteer";
import { Observability } from "../../../observability"
import { puppeteerBrowser } from "../browser/puppeteerBrowser"
import { BrowserConfigPuppeteer, chooseBrowserConfig } from "../browser/config/browseConfigPuppeteer.interface"
import { IRuntime } from "../runtimeBrowser/runtime.interface";
import { BridgeLaunchConfig } from "../../../../config";
import { Browser } from "puppeteer";


export class RuntimeFactory {
  
  async getRuntime(obs: Observability, bridgeLaunchConfig: BridgeLaunchConfig): Promise<IRuntime> {
    
    if (bridgeLaunchConfig.runtime === 'puppeteer') {
      
      return await this.getRuntimePuppeteer(obs, bridgeLaunchConfig);
      
    }
    
    throw new Error(`Unsupported runtime: ${bridgeLaunchConfig.runtime}`);
    
  }
  
  async getRuntimePuppeteer(obs: Observability, bridgeLaunchConfig: BridgeLaunchConfig): Promise<IRuntime> {
    
    const browserConfig: BrowserConfigPuppeteer = chooseBrowserConfig(bridgeLaunchConfig.system, bridgeLaunchConfig.executablePath);
    
    const browser:Browser = await puppeteerBrowser(browserConfig);
    
    return new RuntimePuppeteer(browser, obs);
    
  }
  
}