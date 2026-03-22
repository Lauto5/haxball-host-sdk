import puppeteer, { Browser } from "puppeteer";

export class BrowserProvider {
  
  private static instance: Browser | null = null;

  private constructor() {}

  static async getBrowser(): Promise<Browser> {
    
    if (!this.instance) {
      
      this.instance = await puppeteer.launch({
        
        headless: true,
        
        executablePath: "/usr/bin/chromium-browser",
        
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu"
        ],
      
      });
    }

    return this.instance;
    
  }

  static async closeBrowser(): Promise<void> {
    
    if (this.instance) {
      
      await this.instance.close();
      
      this.instance = null;
      
    }
  }
}