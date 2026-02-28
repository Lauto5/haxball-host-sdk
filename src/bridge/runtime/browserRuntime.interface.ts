import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer"

export interface IBrowserRuntime {
    launch(options?: Partial<LaunchOptions>): Promise<void>;

    launchPage(id: string): Promise<Page>;

    getPage(id: string): Page;

    dispose(): Promise<void>;
    
    disposePage(id: string): Promise<void>;
}