import { BrowserProvider } from "../providers/browserProvider";
import { BrowserRuntime } from "../browser/browserRuntime";
import puppeteer, { Browser } from "puppeteer"
import {ILogger , ScopedLogger} from "../../../logger"

export class RuntimeFactory {
    async getRuntime(rootLoger:ILogger) {
        let logger = new ScopedLogger(rootLoger, "RuntimeFactory");
        logger.debug("Creando Browser");
        const browser = BrowserProvider.getBrowser();
        logger.debug("Browser creado con exito");
        logger.debug("Creando Runtime");
        const runtime = new BrowserRuntime(await browser);
        logger.debug("Runtime creado con exito");
        return runtime;
    }
}