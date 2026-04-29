import { ITrace } from "../../../../observability";
import { BrowserResponse } from "../../responses";

export interface IRequestProcess {
  
  queue: Array<{
    task: () => Promise<BrowserResponse>;
    resolve: (value: BrowserResponse) => void;
    reject: (reason?: any) => void;
  }>;
  
  isProcessing: boolean;
  
  warnQueueSize: number;
  maxQueueSize: number;
  
  add(task: () => Promise<BrowserResponse> , trace: ITrace): Promise<BrowserResponse>;
  
  processQueue(): Promise<void>;
}