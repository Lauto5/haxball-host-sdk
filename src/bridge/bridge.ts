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
  async launchRoom(){
    if (!this.runtime){
      throw new Error("runtime not init");
    }

      let con: RoomConfig = {
          roomName: "NODEJS",
          playerName:"hoosts",
          maxPlayers: 12,
          public:true,
          noPlayer: true,
          token:"thr1.AAAAAGmsCwOJLF3RVHTfZQ.o-Hfwmncrj4"
    }
    
      //this.runtime.launchPage("RoomTest", "https://www.haxball.com/headless", con);
      this.runtime.testLaunchPAge();

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
