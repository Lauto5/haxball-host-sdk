import { RoomConfig } from "#/types/haxball";
import { Bridge, BrowserResponse, MethodRequest} from "./bridge";
import { ILogger, ConsoleLogger, ConsoleMetrics , Observability, IMetrics } from "./observability";
import { ObservabilityConfig, SetupCoreConfig } from "../config/";
import { IBridge } from "./bridge";
import { RoomAdapter } from "./safe/roomAdapter";
import { RoomExecutor } from "./safe";
import { Room } from "./domain/room";

export class HaxballHostSDK {
  
  private observability: Observability;
  
  private logger: ILogger;
  
  private bridge: IBridge
  
  private roomAdapters: Map<string, RoomAdapter> = new Map();
  

  constructor(
    readonly observabilityConfig: ObservabilityConfig = new ObservabilityConfig(2),
    readonly setupConfig: SetupCoreConfig = new SetupCoreConfig("puppeteer", "/usr/bin/chromium-browser"),
  ) {
    
    this.observability = new Observability(observabilityConfig.logging, observabilityConfig.metrics);
    
    this.logger = this.observability.createScopeLogger("HaxballHostSDK");
    
    this.bridge = new Bridge(this.observability);
    
    this.bridgeSetup();
    
  }
  
  private bridgeSetup() {

    this.bridge.on((data: BrowserResponse) => {
      
      const roomAdapter = this.roomAdapters.get(data.id);
      
      if (roomAdapter) {
        roomAdapter.handleEvent(data);
      }

    });
    
    this.bridge.onRoomDeath(() => {
      
      // luego introducir logica.
      
    });
    
  }
  
  async launchRoom(roomConfig: RoomConfig) : Promise<Room> {
    
    if (!this.bridge.isInit()) {
      await this.bridge.init(this.observability, this.setupConfig.getBrowserConfig());
    }
    
    await this.bridge.launchRoom(this.observability, roomConfig, this.setupConfig.getUrlPath());
    
    const roomExecutor: RoomExecutor = new RoomExecutor(roomConfig.roomName, this.bridge);
    
    const room = new Room(roomConfig.roomName, roomExecutor);
    
    const roomAdapter = new RoomAdapter(room, roomConfig.roomName);
    
    this.roomAdapters.set(roomConfig.roomName, roomAdapter);
    
    return room;
    
  }
  
  async reLaunchRoom(roomName: string) {
    
    /* 
    await this.bridge.restartRoom(this.observability, roomConfig);
    */
    
  }
}

  /*
  
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
        
      // probar 400 executes() :
        for (let i = 0; i < 400; i++) {
          bridge.execute({ id: data.id, method: "sendAnnouncement", args: [`${playerName} ${i}`] });
        }
        
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
  
  */
