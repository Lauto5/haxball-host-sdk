import { RoomConfig } from "#/types/haxball";
import { Bridge, BrowserResponse} from "../bridge";
import { ILogger, ConsoleLogger, SafeLogger, ScopedLogger } from "../logger";
import { SetupConfig } from "../setup";

interface SDKOptions {
  logger?: ILogger
}

export class HaxballHostSDK {
  private rootLogger: ILogger;
  private logger: ILogger;

    constructor(options?: SDKOptions) {
    const baseLogger = options?.logger ?? new ConsoleLogger(3);
    this.rootLogger = new SafeLogger(baseLogger);
    this.logger = new ScopedLogger(this.rootLogger , "HBH");
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
      token: "thr1.AAAAAGnSii41y-ydFXubTg.17QTvvujc2k",
      password: "meMata",
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
    
    bridge.onRoomDeath((pageId: string) => {
      
      this.logger.warn(`Room ${pageId} died`);
      
    });
    
    // *LEER* PROXIMO QUE HAGA ES TYPAR Y REORDENAR EL MODULO BRIDGE, AGREGAR COMENTARIOS NECESARIOS Y PENSAR SI HACE FALTA ALGO MAS.
    
    await bridge.launchRoom(roomConfig, setupConfig.getUrlPath());
    
    await bridge.execute(roomConfig.roomName, "setDefaultStadium", ["Big"]);
    
    const urlRoom = bridge.getUrlRoom(roomConfig.roomName);

    this.logger.info(urlRoom);
    
  }

}
