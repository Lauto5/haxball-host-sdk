import { BrowserRuntime } from "./browserRuntime";

export class EvaluationContext {
  constructor(private runtime: BrowserRuntime) {}

  async evaluate<T>(
    pageId: string,
    fn: (...args: any[]) => T,
    args: any[] = []
  ): Promise<T> {
    const page = this.runtime.getPage(pageId);

    try {
      return await page.evaluate(fn, ...args);
    } catch (error: any) {
      throw new Error(
        `[EvaluationError][${pageId}] ${error?.message ?? error}`
      );
    }
  }


}
