import { ILogger, ScopedLogger } from "../logger";
import { BrowserRuntime } from "./runtime/browserRuntime"
import { EvaluationContext } from "./runtime/evaluationContext";
import { Page } from "puppeteer-core";
import { RPCChannel } from "./rpc/rpcChannel";
import { Transport } from "../transport";
import { RPCMessage } from "./rpc/rpcMessage";
import { time } from "node:console";

// probando bridge, luego hacerlo correcto.
export class Bridge {
  private logger: ILogger;
  private browserRuntimer: BrowserRuntime = new BrowserRuntime();
  private evaluationContext: EvaluationContext = new EvaluationContext(this.browserRuntimer);
  private transport: Transport;
  private rpcChannel: RPCChannel;

  constructor(rootLogger: ILogger, transport: Transport) {
    this.logger = new ScopedLogger(rootLogger, "Bridge");
    this.transport = transport;
    this.rpcChannel = new RPCChannel(this.transport);

  }

  existHBInit(): void {
    this.logger.info("Checking if HBInit exists on page 'testPage'...");
    this.browserRuntimer.existHBInit("testPage");
  }

  // probar rpc:
  async testRPC(): Promise<void> {
    this.logger.info("Testing RPC...");
    // registrar un handler de prueba
    this.rpcChannel.registerHandler("test", async () => {
      return "Haxball Host SDK - RPC Test";
    });

    this.rpcChannel.registerHandler("getTitle", async (params: unknown[]) => {
      const pageId = params[0] as string;
      const title = await this.evaluationContext.evaluate(pageId, () => document.title);
      return title;
    });

    /*
    // probar crear una sala de haxball.
    this.rpcChannel.registerHandler("createRoom", async (params: unknown[]) => {
      const roomName = "Test Room";
      const maxPlayers = 4;
      const token = "thr1.AAAAAGmiWG844jb74BvLCQ.yIJCrp-1kyI";

      const config = {
        roomName: roomName,
        maxPlayers: maxPlayers,
        token: token,
        playerName: "",
        password: "",
        isPublic: false,
        isNoPlayer: false
      };

      await this.evaluationContext.evaluate("testPage", (config) => {
        //HBInit(config);

        if (typeof HBInit !== "function") {
          throw new Error("HBInit is not a function");
        }

        this.logger.info("Calling HBInit with config: " + JSON.stringify(config));

        

      }, [config]);
    });
    */

    this.logger.info("RPC handler 'test' registered.");

    // llamar al handler registrado
    try {
      const result = await this.rpcChannel.call("test", []);
      this.logger.info(`RPC call result: ${result}`);
    } catch (error) {
      this.logger.error(`RPC call error: ${error instanceof Error ? error.message : String(error)}`);
    }

    /*
    try {
      const pageId = "testPage";
      const result = await this.rpcChannel.call("getTitle", [pageId]);
      this.logger.info(`RPC call result: ${result}`);
    } catch (error) {
      this.logger.error(`RPC call error: ${error instanceof Error ? error.message : String(error)}`);
    }
    */

    try {
      await this.rpcChannel.call("createRoom", []);
      this.logger.info(`RPC call 'createRoom' executed successfully.`);
    } catch (error) {
      this.logger.error(`RPC call error: ${error instanceof Error ? error.message : String(error)}`);
    }

  }

  // metodos para probar si funciona( todavia en el desarrollo), luego borrar.
  async launchBrowser(): Promise<void> {
    this.logger.info("Launching browser...");
    await this.browserRuntimer.launch();
    this.logger.info("Browser launched.");
  }

  async launchPage(id: string): Promise<void> {
    this.logger.info(`Launching page with ID: ${id}...`);
    let page: Page = await this.browserRuntimer.launchPage(id);
    this.logger.info(`Page '${id}' launched.`);

    // lanzar pagina de prueba
    await page.goto("https://www.haxball.com/headless");
  }

  async evaluateOnPage<T>(pageId: string, fn: (...args: any[]) => T, args: any[] = []): Promise<T> {
    this.logger.info(`Evaluating function on page '${pageId}'...`);
    const result = await this.evaluationContext.evaluate(pageId, fn, args);
    this.logger.info(`Function evaluated on page '${pageId}'.`);
    return result;
  }

  async dispose(): Promise<void> {
    this.logger.info("Disposing browser runtime...");
    await this.browserRuntimer.dispose();
    this.logger.info("Browser runtime disposed.");
  }
}

function HBInit(arg0: { roomName: any; maxPlayers: any; token: any; playerName: string; password: string; isPublic: boolean; isNoPlayer: boolean; }): any {
  throw new Error("Function not implemented.");
}
