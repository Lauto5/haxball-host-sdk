import { RoomConfig } from "#/types/haxball";
import { Bridge, BrowserResponse} from "../bridge";
import { ILogger, ConsoleLogger, SafeLogger } from "../logger";
import { SetupConfig } from "../setup";

interface SDKOptions {
  logger?: ILogger
}

export class HaxballHostSDK {
    private rootLogger: ILogger

    constructor(options?: SDKOptions) {
        const baseLogger = options?.logger ?? new ConsoleLogger(2);
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
      token: "thr1.AAAAAGnRDZ8TY98yf_VN5A.-sw4Lo6uGl8"
    }
    
    const roomConfig2: RoomConfig = {
      roomName: "Haxball-host-sdk-2",
      playerName: "Lauto5",
      maxPlayers: 10,
      public: true,
      noPlayer: true,
      //token: ""//"thr1.AAAAAGnRDm7w-9CS_NsZVA.1Ec8p8Cg8PE"
    }
    
    await bridge.init(this.rootLogger, setupConfig.getBrowserConfig());
    
    bridge.on((data: BrowserResponse) => {
      
      if (data.method === "onPlayerJoin") {
        const playerId = data.response.id;
        const playerName = data.response.name;
        
        bridge.execute(data.id, "setPlayerTeam", [playerId, 1]);
        bridge.execute(data.id, "setPlayerAdmin", [playerId, true]);
        bridge.execute(data.id, "startGame", []);
        bridge.execute(data.id, "sendAnnouncement", [`Welcome to the room! ${playerName}`])
      }
    })
    
    await bridge.launchRoom(roomConfig, setupConfig.getUrlPath());
    
    await bridge.execute(roomConfig.roomName, "setDefaultStadium", ["Big"]);
    
    /*
    
    await bridge.launchRoom(roomConfig2, setupConfig.getUrlPath());
    
    await bridge.execute(roomConfig2.roomName, "setDefaultStadium", ["Huge"]);

    */
    
  }

}
