import { Page } from "puppeteer-core";

export class HostPage {
  constructor(
    private readonly id: string,
    private readonly page: Page
  ) {}

  async evaluate<T>(
    fn: (...args: any[]) => T | Promise<T>,
    ...args: any[]
  ): Promise<T> {
    try {
      return await this.page.evaluate(fn, ...args);
    } catch (error: any) {
      throw new Error(
        `[HostPage][${this.id}] ${error?.message ?? error}`
      );
    }
  }

  async close(): Promise<void> {
    await this.page.close();
  }
}