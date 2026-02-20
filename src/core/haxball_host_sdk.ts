import { Bridge } from "../bridge";
import { ILogger, ConsoleLogger, SafeLogger } from "../logger";

interface SDKOptions {
  logger?: ILogger
}

export class HaxballHostSDK {
    private rootLogger: ILogger

    constructor(options?: SDKOptions) {
        const baseLogger = options?.logger ?? new ConsoleLogger()
        this.rootLogger = new SafeLogger(baseLogger)
  }

  // (desarrollo) metodos para probar el bridge, luego borrar.
  async testBridge(): Promise<void> {
    const bridge = new Bridge(this.rootLogger);
    await bridge.launchBrowser();
    await bridge.launchPage("testPage");
    const title = await bridge.evaluateOnPage("testPage", () => document.title);
    this.rootLogger.info(`Evaluated title: ${title}`);
    //await bridge.dispose();
  }

}
