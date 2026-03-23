import { ILogger, ScopedLogger } from "../logger";
import { ITransport } from "./transport/transport.interface";
import { EventResponse, RuntimeFactory } from "./runtime";
import { RoomConfig } from "../types/haxball";
import { IBridge } from "./bridge.interface";
import { IBox } from "./box/box.interface";
import { IRuntime } from "./runtime/runtimeBrowser/runtime.interface";
import { BridgeLaunchConfig } from "../types/haxball";

export class Bridge implements IBridge{
  
  private logger: ILogger;
  
  private runtime?: IRuntime;
  
  private boxs = new Map<string, IBox>();
  
  private transport?: ITransport;

  constructor(rootLogger: ILogger) {
    
    this.logger = new ScopedLogger(rootLogger, "Bridge");
    
  }

  async launchBridge(rootLogger: ILogger, transport: ITransport, bridgeLaunchConfig: BridgeLaunchConfig){
    
    const runtimeFactory = new RuntimeFactory();
    
    this.runtime = await runtimeFactory.getRuntime(rootLogger, bridgeLaunchConfig);
    
    if (this.runtime) {
      
      await this.reciveEvents(this.runtime);
    
    }
    
    this.transport = transport;
  }
  
  launchBox(roomConfig: RoomConfig): void{
    
  }
  
  private async reciveEvents(runtime: IRuntime) {
    
    runtime.on(async (data: EventResponse) => {
      
      this.logger.debug("event", { id: data.id, method: data.method, response: data.response })
      
      if (this.runtime) {
        if( data.method === "onPlayerJoin") {
          const result = await this.runtime.execute(data.id, "getPlayerList", []);
          this.logger.debug("playerList", result);
        }
      }
      
      
      
    });
    
  }
  
  // metodo de test
  async launchRoom(rootLogger: ILogger, roomConfig: RoomConfig, urlPath: string) {
    if (!this.runtime) {
      throw new Error("runtime not init");
    }
    
    await this.runtime.launchPage(rootLogger, roomConfig.roomName, urlPath, roomConfig);
    
    await this.runtime.execute(roomConfig.roomName, "setDefaultStadium", ["Huge"]);
    
    const scores = await this.runtime.execute(roomConfig.roomName, "getScores", []);
    
    this.logger.debug("scores", scores);

  }
}
