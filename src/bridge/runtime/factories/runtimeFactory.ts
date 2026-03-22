import { BrowserProvider } from "../providers/browserProvider";
import { Runtime } from "../runtime";
import { ILogger } from "../../../logger"

export class RuntimeFactory {
  
  async getRuntime(rootLoger: ILogger) {
        
    const browser = await BrowserProvider.getBrowser();
        
    const runtime = new Runtime(browser, rootLoger);
        
    return runtime;
    
    }
}