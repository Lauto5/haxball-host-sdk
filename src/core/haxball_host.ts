import { Bridge, BrowserResponse} from "./bridge";
import { ILogger, Observability } from "./observability";
import { ObservabilityConfig, SetupEngineConfig } from "../config";
import { IBridge } from "./bridge";
import { RoomAdapter } from "./safe/roomAdapter";
import { RoomExecutor } from "./safe";
import { Room, RoomProvider, RoomConfig } from "./domain";
import { BannerPrinter , Version} from "../org";

export class HaxballHost {
  
  private observability: Observability;
  
  private logger: ILogger;
  
  private bridge: IBridge
  
  private rooms: Map<string , RoomProvider> = new Map();
  
  private roomAdapters: Map<string, RoomAdapter> = new Map();
  
  private roomsConfig: Map<string, RoomConfig> = new Map();
  

  constructor(
    readonly observabilityConfig: ObservabilityConfig = new ObservabilityConfig(3),
    readonly setupEngineConfig: SetupEngineConfig = new SetupEngineConfig("puppeteer", "/usr/bin/chromium-browser"),
  ) {
    
    BannerPrinter.printBanner(Version.version);
    
    this.observability = new Observability(observabilityConfig.logging, observabilityConfig.metrics);
    
    this.logger = this.observability.createScopeLogger("HaxballHostSDK");
    
    this.bridge = new Bridge(this.observability);
    
    this.bridgeSetup();
    
  }
  
  private bridgeSetup() {

    this.bridge.on((data: BrowserResponse) => {
      
      const roomAdapter = this.roomAdapters.get(data.id);
      
      if (roomAdapter) {
      
        this.logger.debug(`Received event: ${data.method}`, data);
        
        roomAdapter.handleEvent(data);
      }

    });
    
    this.bridge.onRoomDeath((id: string) => {
      
      const roomAdapter = this.roomAdapters.get(id);
      
      if (roomAdapter) {
        
        this.logger.debug(`Room death: ${id}`);
        
        roomAdapter.handleEvent({id : id , method : "onRoomDeath", response: null});
      }
      
      this.logger.info(`Room death: ${id}`);
      
    });
    
  }
  
  async createRoom(config: RoomConfig) : Promise<Room> {
    
    if (!this.bridge.isInit()) {
        await this.bridge.init(this.observability, this.setupEngineConfig.getBrowserConfig());
    }
    
    this.logger.debug(`Creating room: ${config.roomName}`);
    
    await this.bridge.launchRoom(this.observability, config, this.setupEngineConfig.getUrlPath());
    
    this.logger.debug(`Room created: ${config.roomName}`);
    
    const roomId = config.roomName;
    
    const executor = new RoomExecutor(roomId, this.bridge);
    const room = new RoomProvider(roomId, executor);
    const adapter = new RoomAdapter(room, roomId);
    
    this.roomAdapters.set(roomId, adapter);
    
    this.roomsConfig.set(roomId, config);
    
    this.rooms.set(roomId, room);
    
    this.logger.debug(`Room adapter created: ${roomId}`);
    
    this.logger.info(`Room created: ${roomId}`);
    
    return room;
    
  }
  
  async restartRoom(roomName: string) {
    
    if (!this.bridge.isInit()) {
      throw new Error("Bridge is not initialized");
    }
    
    this.logger.debug(`Re-launching room: ${roomName}`);
    
    const config = this.roomsConfig.get(roomName);
    
    if (!config) {
      throw new Error(`Room config not found: ${roomName}`);
    }
    
    await this.bridge.restartRoom(this.observability, config);
    
    this.roomAdapters.delete(roomName);
    
    const executor = new RoomExecutor(roomName, this.bridge);
    
    const room = this.rooms.get(roomName);
    
    if (!room) {
      throw new Error(`Room not found: ${roomName}`);
    }
    
    room.setExecutor(executor);
    
    const adapter = new RoomAdapter(room, roomName);
    
    this.roomAdapters.set(roomName, adapter);
    
    this.logger.debug(`Room re-launched: ${roomName}`);
    
    this.logger.info(`Room re-launched: ${roomName}`);
    
  }
  
  async closeRoom(roomName: string) {
    
    if (!this.bridge.isInit()) {
      throw new Error("Bridge is not initialized");
    }
    
    this.logger.debug(`Closing room: ${roomName}`);
    
    await this.bridge.closeRoom(roomName);
    
    this.roomAdapters.delete(roomName);
    
    this.rooms.delete(roomName);
    
    this.roomsConfig.delete(roomName);
    
    this.logger.debug(`Room closed: ${roomName}`);
    
    this.logger.info(`Room closed: ${roomName}`);
    
  }
  
}