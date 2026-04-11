import { RoomConfig } from "#/types/haxball";
import { Bridge, BrowserResponse, MethodRequest} from "../bridge";
import { ILogger, ConsoleLogger, ConsoleMetrics , Observability, IMetrics } from "../observability";
import { SetupConfig } from "../setup";

interface SDKOptions {
  logger?: ILogger;
  metrics?: IMetrics;
}

export class HaxballHostSDK {
  private obs: Observability;
  private logger: ILogger;

  constructor(options?: SDKOptions) {
    const Ilogger : ILogger = options?.logger ?? new ConsoleLogger(3);
    const Imetrics : IMetrics = options?.metrics ?? new ConsoleMetrics(Ilogger);
    this.obs = new Observability(Ilogger, Imetrics);
    this.logger = this.obs.createScopeLogger("HBH");
  }

  // (desarrollo) metodos para probar el bridge, luego borrar.
  async testBridge(): Promise<void> {
    
    const bridge = new Bridge(this.obs);
    
    const tracer = this.obs.getTracer();
    const trace = tracer.startTrace("HBH");
    
    const span = trace.startSpan("testBridge");    
    
    const setupConfig = new SetupConfig("puppeteer","/usr/bin/chromium-browser");
    
    const roomConfig: RoomConfig = {
      roomName: "Haxball-host-sdk-1",
      maxPlayers: 10,
      public: true,
      noPlayer: true,
      token: "thr1.AAAAAGnae1TlIlHEevsikw.yWFwhmsaYOE",
    }
    
    await bridge.init(this.obs , setupConfig.getBrowserConfig());
    
    bridge.on((data: BrowserResponse) => {
      
      if (data.method === "onPlayerJoin") {
        const playerId = data.response.id;
        const playerName = data.response.name;
        
        bridge.execute({ id: data.id, method: "setPlayerTeam", args: [playerId, 1] });
        bridge.execute({ id: data.id, method: "setPlayerAdmin", args: [playerId, true] });
        bridge.execute({ id: data.id, method: "startGame", args: [] });
        bridge.execute({ id: data.id, method: "sendAnnouncement", args: [`Welcome to the room! ${playerName}`] });
        
      }
    })
    
    bridge.onRoomDeath((pageId: string) => {
      
      this.logger.warn(`Room ${pageId} died`);
      
    });
    
    await bridge.launchRoom(this.obs ,roomConfig, setupConfig.getUrlPath());

    const urlRoom = bridge.getUrlRoom(roomConfig.roomName);

    this.logger.info(urlRoom);
    
    span.end();

  }

}
