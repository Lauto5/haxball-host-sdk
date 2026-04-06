import { RoomConfig } from "#/types/haxball";
import { Bridge, BrowserResponse, MethodRequest} from "../bridge";
import { ILogger, ConsoleLogger, SafeLogger, ScopedLogger } from "../observability/logger";
import { SetupConfig } from "../setup";

interface SDKOptions {
  logger?: ILogger
}

export class HaxballHostSDK {
  private rootLogger: ILogger;
  private logger: ILogger;

    constructor(options?: SDKOptions) {
    const baseLogger = options?.logger ?? new ConsoleLogger(2);
    this.rootLogger = new SafeLogger(baseLogger);
    this.logger = new ScopedLogger(this.rootLogger , "HBH");
  }

  // (desarrollo) metodos para probar el bridge, luego borrar.
  async testBridge(): Promise<void> {
    
    const bridge = new Bridge(this.rootLogger);
    
    const setupConfig = new SetupConfig("puppeteer","/usr/bin/chromium-browser");
    
    const roomConfig: RoomConfig = {
      roomName: "Haxball-host-sdk-1",
      maxPlayers: 10,
      public: true,
      noPlayer: true,
      token: "thr1.AAAAAGnTeLZCuPuFyQU29g.kmGupj089b8",
    }
    
    await bridge.init(this.rootLogger, setupConfig.getBrowserConfig());
    
    bridge.on((data: BrowserResponse) => {
      
      if (data.method === "onPlayerJoin") {
        const playerId = data.response.id;
        const playerName = data.response.name;
        
        bridge.execute({ id: data.id, method: "setPlayerTeam", args: [playerId, 1] });
        bridge.execute({ id: data.id, method: "setPlayerAdmin", args: [playerId, true] });
        bridge.execute({ id: data.id, method: "startGame", args: [] });
        bridge.execute({ id: data.id, method: "sendAnnouncement", args: [`Welcome to the room! ${playerName}`] });
        
        // probando ejecutar multiples veces un metodo:
        for (let i = 0; i < 500 ; i++) {
          bridge.execute({ id: data.id, method: "sendAnnouncement", args: [`Numero de ejecucion : ${i}`] });
          
          bridge.execute({ id: data.id, method: "setPlayerTeam", args: [playerId, i % 2] });
          
        }
        
      }
    })
    
    bridge.onRoomDeath((pageId: string) => {
      
      this.logger.warn(`Room ${pageId} died`);
      
    });

    await bridge.launchRoom(roomConfig, setupConfig.getUrlPath());

    await bridge.execute({ id: roomConfig.roomName, method: "setDefaultStadium", args: ["Big"] });

    const urlRoom = bridge.getUrlRoom(roomConfig.roomName);

    this.logger.info(urlRoom);

  }

}
