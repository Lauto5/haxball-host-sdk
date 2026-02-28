import { Transport } from "../transport";
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
    const transport = new Transport(this.rootLogger);
    const bridge = new Bridge(this.rootLogger, transport);
    // test de todo:
    await bridge.launchBrowser();
    await bridge.launchPage("testPage");
    bridge.existHBInit();
    //await bridge.testRPC();
    //await bridge.dispose();
  }

}
