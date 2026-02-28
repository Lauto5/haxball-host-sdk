import { ILogger, ScopedLogger } from "../logger";
import { BrowserRuntime } from "./runtime/browserRuntime"
import { RPCChannel } from "./rpc/rpcChannel";
import { Transport } from "../transport";
import { BrowserProvider } from "./runtime/browserProvider";
import { Browser } from "puppeteer-core";

// probando bridge, luego hacerlo correcto.
export class Bridge {
  private logger: ILogger;
  private browser?: Browser;
  private runtime?: BrowserRuntime;
  private transport: Transport;
  private rpcChannel?: RPCChannel;

  constructor(rootLogger: ILogger, transport: Transport) {
    this.logger = new ScopedLogger(rootLogger, "Bridge");
    this.transport = transport;
    
    
  }

  async launchBridge(){
    this.browser = await BrowserProvider.getBrowser();
    this.runtime = new BrowserRuntime(this.browser);
    this.rpcChannel = new RPCChannel(this.transport);
  }



}
