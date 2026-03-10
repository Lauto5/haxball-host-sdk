import { ILogger, ScopedLogger } from "../logger";
import { ITransport } from "./transport/transport.interface";
import { Runtime, RuntimeFactory } from "./runtime";
import { RoomConfig } from "../types/haxball";
import { IBridge } from "./bridge.interface";
import { IBox } from "./box/box.interface";

export class Bridge implements IBridge {
  private logger: ILogger;
  private runtime?: Runtime;
  private boxs = new Map<string, IBox>();

  constructor(rootLogger: ILogger) {
    this.logger = new ScopedLogger(rootLogger, "Bridge")
  }

  async launchBridge(rootLogger: ILogger){
    let runtimeFactory = new RuntimeFactory();
    this.runtime = await runtimeFactory.getRuntime(rootLogger);
  }

  setupTransport(transport: ITransport): void{
    
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
      token: "thr1.AAAAAGmuqigH7OoW-LATlw.f7fcZdhIv0Q"
      
    }
    
    let url = "https://www.haxball.com/headless"
    
    let pageId1 = "testRoom"
    
    await this.runtime.launchPage(rootLogger, pageId1, url, config);
    
    await this.runtime.execute(pageId1, "setDefaultStadium", ["Huge"]);

  }
}
