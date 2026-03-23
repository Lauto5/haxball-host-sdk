import { RoomConfig } from "#/types/haxball";
import { Bridge , Transport} from "../bridge";
import { ILogger, ConsoleLogger, SafeLogger } from "../logger";
import { SetupConfig } from "../setup";

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
    
    const bridge = new Bridge(this.rootLogger);
    
    const setupConfig = new SetupConfig("puppeteer","/usr/bin/chromium-browser");
    
    const roomConfig: RoomConfig = {
      roomName: "Haxball-host-sdk",
      playerName: "Lauto5",
      maxPlayers: 10,
      public: true,
      noPlayer: true,
      token: "thr1.AAAAAGnAbRAd5WO5SqWlKg.SPVvQq-wlKA"
    }
    
    await bridge.launchBridge(this.rootLogger, transport, setupConfig.getBrowserConfig());
    
    await bridge.launchRoom(this.rootLogger, roomConfig, setupConfig.getUrlPath());

  }

}
