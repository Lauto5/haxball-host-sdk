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
  async launchRoom(rootLogger: ILogger){
    if (!this.runtime){
      throw new Error("runtime not init");
    }

      let config: RoomConfig = {
          roomName: "NODEJS",
          playerName:"hoosts",
          maxPlayers: 10,
          public:true,
          noPlayer: true,
          token:"thr1.AAAAAGmsmOIyKNAUCg4kTA.W7h8WdBiZMQ"
      }
    
      let url = "https://www.haxball.com/headless"
    
      this.runtime.launchPage(rootLogger, "node-js-test", url, config);

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
