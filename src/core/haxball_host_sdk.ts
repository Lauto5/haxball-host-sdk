import { RoomConfig } from "#/types/haxball";
import { Bridge, BrowserResponse, MethodRequest} from "./bridge";
import { ILogger, ConsoleLogger, ConsoleMetrics , Observability, IMetrics } from "./observability";
import { ObservabilityConfig, SetupCoreConfig } from "../config/";
import { IBridge } from "./bridge";

export class HaxballHostSDK {
  
  private observability: Observability;
  
  private logger: ILogger;
  
  private bridge: IBridge

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

      // luego introducir logica.
      //
      // Logica para testear comandos, luego borrar:

      if (data.method === "onPlayerCommand") {

        const msg: string = data.response[1];

        this.logger.debug("onPlayerCommand received", { msg });

        switch (msg) {
          case "!startGame":
            
            this.logger.debug("startGame command received", { msg });

            this.bridge.execute({ id: data.id, method: "sendChat", args: ["Game starting"] });

            this.bridge.execute({ id: data.id, method: "startGame", args: [] });
            break;
          
          // en el caso de no existir mandar un mensaje a el jugador de que no existe el comando:
          default:
            this.logger.debug("command not found", { msg });
            // args : msg, targetId, color , style , sound
            this.bridge.execute({ id: data.id, method: "sendAnnouncement", args: ["command not found" , data.response[0].id , 0xFF0000 , "bold", 0] });
            break;
        }

      }


    });
    
    this.bridge.onRoomDeath(() => {
      
      // luego introducir logica.
      
    });
    
  }
  
  async launchRoom(roomConfig: RoomConfig) {
    
    if (!this.bridge.isInit()) {
      await this.bridge.init(this.observability, this.setupConfig.getBrowserConfig());
    }
    
    await this.bridge.launchRoom(this.observability, roomConfig, this.setupConfig.getUrlPath());
    
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
