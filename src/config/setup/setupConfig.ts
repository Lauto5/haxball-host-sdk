
import { getOperatingSystem } from "./readSystemOperative"
import { BridgeLaunchConfig } from "./bridgeLaunchConfig.interface"

/**
 * Represents the configuration for the setup engine.
 * 
 * @param runtime The runtime to use for the setup engine.
 * @example
 * ```ts
 * const config = new SetupConfig("puppeteer");
 * ```
 * @param browserPath The path to the browser executable.
 * @example
 * ```ts
 * const config = new SetupConfig("puppeteer", "/path/to/chrome");
 * ```
 * @param urlApi The URL API (https://www.haxball.com/headless) to use for the setup engine.
 * @example
 * ```ts
 * const config = new SetupConfig("puppeteer", "/path/to/chrome", "https://www.haxball.com/headless");
 * ```
 */
export class SetupConfig {
  
  private urlPath: string = "https://www.haxball.com/headless";
  
  constructor(private runtime: "puppeteer" | "playwright",private browserPath?: string, urlApi?: string) {
    
    if (urlApi) {
      
      this.urlPath = urlApi;
      
    }
    
  }
  
  getUrlPath(): string {
    
    return this.urlPath;
    
  }
  
  getBrowserConfig(): BridgeLaunchConfig {
    
    const system = getOperatingSystem();
    
    return {
      runtime: this.runtime,
      system,
      executablePath: this.browserPath
    }
    
  }

}