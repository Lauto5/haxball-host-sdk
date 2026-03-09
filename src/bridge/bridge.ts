import { ILogger, ScopedLogger } from "../logger";
import { RPCChannel } from "./rpc/rpcChannel";
import { Transport } from "./transport/transport";
import { Runtime, RuntimeFactory } from "./runtime";
import { RoomConfig } from "../types/haxball";

export class Bridge {
  private logger: ILogger;
  private runtime?: Runtime;
  private transport: Transport;
  private rpcChannel?: RPCChannel;

  constructor(rootLogger: ILogger, transport: Transport) {
    this.logger = new ScopedLogger(rootLogger, "Bridge");
    this.transport = transport;
  }

  async launchBridge(rootLogger: ILogger){
    let runtimeFactory = new RuntimeFactory();
    this.runtime = await runtimeFactory.getRuntime(rootLogger);
    this.rpcChannel = new RPCChannel(this.transport ,10000, rootLogger);
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
    
    // ***LEER IMPORTANTE***
    // luego ver como podemos implementar la comunicacion de los eventos del runtime con el bridge.
    

  }

  // metodo de test
  public registrarMetodo(method:string,handler: (params: unknown[]) => unknown | Promise<unknown>):void{
    if (!this.rpcChannel){
      throw new Error("Rpc-Channel not initialized. Call launchBridge() first");
    }
    this.rpcChannel.registerHandler(method,handler);
  }

  // metodo de test
  public llamar(method: string, params?: unknown[], timeoutMs?: number): Promise<unknown>{
    if (!this.rpcChannel){
      throw new Error("Rpc-Channel not initialized. Call launchBridge() first");
    }
    let result = this.rpcChannel.call(method,params,timeoutMs);
    return result;
  }
}
