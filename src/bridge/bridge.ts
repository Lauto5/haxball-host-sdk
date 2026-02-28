import { ILogger, ScopedLogger } from "../logger";
import { RPCChannel } from "./rpc/rpcChannel";
import { Transport } from "../transport";
import { BrowserProvider } from "./runtime/providers/browserProvider";
import { Browser } from "puppeteer-core";
import { BrowserRuntime } from "./runtime";

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

  public async testRuntime(): Promise<void> {
  if (!this.runtime) {
    throw new Error("Runtime not initialized. Call launchBridge() first.");
  }

  const testPageId = "test-page";

  this.logger.info("Starting BrowserRuntime test...");

  try {
    // 1️⃣ Lanzar página
    await this.runtime.launchPage(testPageId, "https://haxball.com");
    this.logger.info(`Page ${testPageId} launched`);

    // 2️⃣ Evaluar algo simple
    const pageTitle = await this.runtime.evaluate(
      testPageId,
      () => document.title
    );
    this.logger.info(`Evaluation result: page title = "${pageTitle}"`);

    // 3️⃣ Evaluar con argumento
    const sum = await this.runtime.evaluate(
      testPageId,
      (a: number, b: number) => a + b,
      5,
      7
    );
    this.logger.info(`Evaluation result with args: 5 + 7 = ${sum}`);

    // 4️⃣ Cerrar página
    await this.runtime.closePage(testPageId);
    this.logger.info(`Page ${testPageId} closed`);

    this.logger.info("BrowserRuntime test completed successfully ✅");
  } catch (error: any) {
    this.logger.error("BrowserRuntime test failed", error);
    throw error;
  }
}
}
