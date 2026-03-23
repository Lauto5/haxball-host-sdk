
import { getOperatingSystem } from "./readSystemOperative"
import { BridgeLaunchConfig } from "../types/haxball"

export class SetupConfig {
  
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