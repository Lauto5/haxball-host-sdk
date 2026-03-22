
import { BrowserConfigPuppeteer } from './config/browseConfigPuppeteer.interface';

export class PuppeteerBrowser {
  private browser: any;
  private config: BrowserConfigPuppeteer;

  constructor(config: BrowserConfigPuppeteer) {
    this.config = config;
  }

  async getBrowser() {
    if (!this.browser) {
      await this.launch();
    }
    return this.browser;
  }

  private async launch() {
    const puppeteer = await import('puppeteer');
    this.browser = await puppeteer.launch({
      headless: this.config.headless,
      executablePath: this.config.executablePath,
      args: this.config.args,
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}