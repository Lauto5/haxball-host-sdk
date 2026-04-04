import { RoomConfig } from "#/types/haxball";
import { launch } from "puppeteer";
import { Bridge} from "../bridge";
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
    
    const bridge = new Bridge(this.rootLogger);
    
    const setupConfig = new SetupConfig("puppeteer","/usr/bin/chromium-browser");
    
    const roomConfig: RoomConfig = {
      roomName: "Haxball-host-sdk",
      playerName: "Lauto5",
      maxPlayers: 10,
      public: true,
      noPlayer: true,
      token: "thr1.AAAAAGnPzXwL-vwigbrSXQ.uNksxVYJtSI"
    }
    
    const roomConfig2: RoomConfig = {
      roomName: "Haxball-host-sdk-2",
      playerName: "Lauto5",
      maxPlayers: 10,
      public: true,
      noPlayer: true,
      token: "thr1.AAAAAGnPzmMX0vVfWErW8g.fqCwOWsLvnw"
    }
    
    await bridge.init(this.rootLogger, setupConfig.getBrowserConfig());
    
    bridge.on((data) => {
      
      console.log(`Event: ${data.method}`, data.response);
      
      if (data.method === "onPlayerJoin") {
        const playerId = data.response.id;
        console.log(`Player joined: ${playerId}`);
        bridge.execute(data.id, "setPlayerTeam", [playerId, 1]);
        bridge.execute(data.id, "setPlayerAdmin", [playerId, true]);
        bridge.execute(data.id, "startGame", []);  
      }
    })
    
    await bridge.launchRoom(roomConfig, setupConfig.getUrlPath());
    
    await bridge.launchRoom(roomConfig2, setupConfig.getUrlPath());
    
    await bridge.execute(roomConfig.roomName, "setDefaultStadium", ["Big"]);
    
    await bridge.execute(roomConfig2.roomName, "setDefaultStadium", ["Huge"]);

  }

}
