import { BrowserProvider } from "../providers/browserProvider";
import { Runtime } from "../browser/runtime";
import puppeteer, { Browser } from "puppeteer"
import {ILogger , ScopedLogger} from "../../../logger"

export class RuntimeFactory {
    async getRuntime(rootLoger:ILogger) {
        let logger = new ScopedLogger(rootLoger, "RuntimeFactory");
        const browser = BrowserProvider.getBrowser();
        const runtime = new Runtime(await browser , rootLoger);
        logger.debug("🛠 Runtime creado con exito");
        return runtime;
    }
}