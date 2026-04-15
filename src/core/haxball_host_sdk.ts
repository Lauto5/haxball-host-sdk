import { Bridge, BrowserResponse} from "./bridge";
import { ILogger, LogLevel, Observability } from "./observability";
import { ObservabilityConfig, SetupCoreConfig } from "../config";
import { IBridge } from "./bridge";
import { RoomAdapter } from "./safe/roomAdapter";
import { RoomExecutor } from "./safe";
import { Room, RoomProvider, RoomConfig } from "./domain";

export class HaxballHostSDK {
  
  private observability: Observability;
  
  private logger: ILogger;
  
  private bridge: IBridge
  
  private roomAdapters: Map<string, RoomAdapter> = new Map();
  

  constructor(
    readonly observabilityConfig: ObservabilityConfig = new ObservabilityConfig(3),
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
    
    this.bridge.onRoomDeath((id: string) => {
      
      const roomAdapter = this.roomAdapters.get(id);
      
      if (roomAdapter) {
        roomAdapter.handleEvent({id : id , method : "onRoomDeath", response: null});
      }
      
    });
    
  }
  
  async createRoom(config: RoomConfig) : Promise<Room> {
    
    if (!this.bridge.isInit()) {
        await this.bridge.init(this.observability, this.setupConfig.getBrowserConfig());
      }
    
    await this.bridge.launchRoom(this.observability, config, this.setupConfig.getUrlPath());
    
    const roomId = config.roomName;
    
    const executor = new RoomExecutor(roomId, this.bridge);
    const room = new RoomProvider(roomId, executor);
    const adapter = new RoomAdapter(room, roomId);
    
    this.roomAdapters.set(roomId, adapter);
    
    return room;
    
  }
  
  async reLaunchRoom(roomName: string) {
    
    
    
  }
}