
import { getOperatingSystem } from "./readSystemOperative"
import { BridgeLaunchConfig } from "./bridgeLaunchConfig.interface"

/**
 * Represents the configuration for the setup engine.
 * 
 * @param runtime The runtime to use for the setup engine.
 * @example
 * ```ts
 * const config = new SetupEngineConfig("puppeteer", "");
 * ```
 * @param browserPath The path to the browser executable.
 * @example
 * ```ts
 * const config = new SetupEngineConfig("puppeteer", "/path/to/chrome");
 * ```
 * @param urlPath The URL path to use for the setup engine.
 * @example
 * ```ts
 * const config = new SetupEngineConfig("puppeteer", "/path/to/chrome", "https://www.haxball.com/headless");
 * ```
 */
export class SetupEngineConfig {
  
  private urlPath: string = "https://www.haxball.com/headless";
  
  constructor(private runtime: "puppeteer" | "playwright",private browserPath: string, urlPath?: string) {
    
    if (urlPath) {
      
      this.urlPath = urlPath;
      
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