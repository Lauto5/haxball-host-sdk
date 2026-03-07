import { Bridge , Transport} from "../bridge";
import { ILogger, ConsoleLogger, SafeLogger } from "../logger";

interface SDKOptions {
  logger?: ILogger
}

export class HaxballHostSDK {
    private rootLogger: ILogger

    constructor(options?: SDKOptions) {
        const baseLogger = options?.logger ?? new ConsoleLogger(3);
        this.rootLogger = new SafeLogger(baseLogger);
  }

  // (desarrollo) metodos para probar el bridge, luego borrar.
  async testBridge(): Promise<void> {
    const transport = new Transport(this.rootLogger);
    const bridge = new Bridge(this.rootLogger, transport);
    await bridge.launchBridge(this.rootLogger);
    await bridge.launchRoom(this.rootLogger);

  }

}
