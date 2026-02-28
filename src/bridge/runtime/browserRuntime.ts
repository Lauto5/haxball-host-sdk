
import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer"
import { IBrowserRuntime } from "./browserRuntime.interface";
import { HostPage } from "./hostPage";

export class BrowserRuntime implements IBrowserRuntime {
    
    private browser:Browser;
    private pages = new Map<string, HostPage>();

    constructor(browser:Browser) {
        this.browser = browser;
    }

    async launchPage(pageId: string): Promise<void> {
    if (this.pages.has(pageId)) {
      throw new Error(`Page ${pageId} already exists`);
    }

    const page: Page = await this.browser.newPage();
    const hostPage = new HostPage(pageId, page);

    this.pages.set(pageId, hostPage);
  }

  async closePage(pageId: string): Promise<void> {
    const hostPage = this.pages.get(pageId);
    if (!hostPage) {
      throw new Error(`Page ${pageId} not found`);
    }

    await hostPage.close();
    this.pages.delete(pageId);
  }

  async evaluate<T>(
    pageId: string,
    fn: (...args: any[]) => T | Promise<T>,
    ...args: any[]
  ): Promise<T> {
    const hostPage = this.pages.get(pageId);
    if (!hostPage) {
      throw new Error(`Page ${pageId} not found`);
    }

    return hostPage.evaluate(fn, ...args);
  }
    
}