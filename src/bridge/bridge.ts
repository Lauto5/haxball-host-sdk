import { ILogger, ScopedLogger } from "../logger";
import { ITransport } from "./transport/transport.interface";
import { EventResponse, Runtime, RuntimeFactory } from "./runtime";
import { RoomConfig } from "../types/haxball";
import { IBridge } from "./bridge.interface";
import { IBox } from "./box/box.interface";
import { IRuntime } from "./runtime/runtime.interface";

export class Bridge implements IBridge{
  
  private logger: ILogger;
  
  private runtime?: Runtime;
  
  private boxs = new Map<string, IBox>();
  
  private transport?: ITransport;

  constructor(rootLogger: ILogger) {
    
    this.logger = new ScopedLogger(rootLogger, "Bridge");
    
  }

  async launchBridge(rootLogger: ILogger, transport: ITransport){
    
    let runtimeFactory = new RuntimeFactory();
    
    this.runtime = await runtimeFactory.getRuntime(rootLogger);
    
    if (this.runtime) {
      
      this.reciveEvents(this.runtime);
    
    }
    
    this.transport = transport;
  }
  
  launchBox(roomConfig: RoomConfig): void{
    
  }
  
  private reciveEvents(runtime: IRuntime) {
    
    runtime.on((data: EventResponse) => {
      
      this.logger.debug("event", { id: data.id, method: data.method, response: data.response })
      
    });
    
  }
  
  // metodo de test
  async launchRoom(rootLogger: ILogger) {
    if (!this.runtime) {
      throw new Error("runtime not init");
    }

    let config: RoomConfig = {
      roomName: "Haxball-host-sdk-WOW",
      playerName: "Lauto5",
      maxPlayers: 10,
      public: true,
      noPlayer: true,
      token: "thr1.AAAAAGm7iQYywafcbyZRXA.Vs5GFWGUnIc"
      
    }
    
    let url = "https://www.haxball.com/headless"
    
    let pageId1 = "testRoom"
    
    await this.runtime.launchPage(rootLogger, pageId1, url, config);
    
    await this.runtime.execute(pageId1, "setDefaultStadium", ["Huge"]);

  }
}
