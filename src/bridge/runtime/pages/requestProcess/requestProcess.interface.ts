
import { BrowserResponse } from "../../responses/browserResponse.interface";

export interface IRequestProcess {
  
  queue: Array<{
    task: () => Promise<BrowserResponse>;
    resolve: (value: BrowserResponse) => void;
    reject: (reason?: any) => void;
  }>;
  
  isProcessing: boolean;
  
  warnQueueSize: number;
  maxQueueSize: number;
  
  add(task: () => Promise<BrowserResponse>): Promise<BrowserResponse>;
  
  processQueue(): Promise<void>;
}