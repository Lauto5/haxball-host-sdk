import { BrowserRuntime } from "./browserRuntime";

export class EvaluationContext {
  evaluateOnPage(pageId: string, arg1: () => Promise<string>): unknown {
    throw new Error("Method not implemented.");
  }
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
