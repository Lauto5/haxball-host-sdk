
import { BrowserResponse, IBridge } from "../bridge"


export class SafeExecute {
  
  constructor(private id: string, private bridge: IBridge){}
  
  async execute<T = any>(method: string, args: any[]): Promise<T> {
    
    try {
      
      const response: BrowserResponse = await this.bridge.execute({
        id: this.id,
        method,
        args,
      });
  
      return response.response as T;
  
    } catch (error) {
      
      throw new Error(
        `SafeExecute failed [room=${this.id}, method=${method}]: ${error}`
      );
      
    }
  }
}