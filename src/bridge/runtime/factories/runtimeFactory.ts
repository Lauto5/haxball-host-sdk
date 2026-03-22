import { BrowserProvider } from "../providers/browserProvider";
import { Runtime } from "../browser/runtime";
import {ILogger , ScopedLogger} from "../../../logger"

export class RuntimeFactory {
  
  async getRuntime(rootLoger: ILogger) {
          
    let logger = new ScopedLogger(rootLoger, "RuntimeFactory");
        
    const browser = await BrowserProvider.getBrowser();
        
    const runtime = new Runtime(browser, rootLoger);
        
    logger.debug("Runtime creado con exito");
        
    return runtime;
    
    }
}