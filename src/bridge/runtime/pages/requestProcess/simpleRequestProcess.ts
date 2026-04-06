import { BrowserResponse } from "../../responses/browserResponse.interface";

import { IRequestProcess } from "./requestProcess.interface";

import { ILogger , ScopedLogger } from "../../../../observability";

export class SimpleRequestQueue implements IRequestProcess {

  
  queue: Array<{
    task: () => Promise<BrowserResponse>;
    resolve: (value: BrowserResponse) => void;
    reject: (reason?: any) => void;
  }> = [];
  
  isProcessing = false;
  
  warnQueueSize: number;
  
  maxQueueSize: number;

  private logger: ILogger;
  
  constructor(logger: ILogger ,warnQueueSize = 1000, maxQueueSize = 5000) {
    this.warnQueueSize = warnQueueSize;
    this.maxQueueSize = maxQueueSize;
    this.logger = new ScopedLogger(logger, "SimpleRequestQueue");
  }

  add(task: () => Promise<BrowserResponse>): Promise<BrowserResponse> {
    if (this.queue.length >= this.maxQueueSize) {
      this.logger.error("Queue overflow");
      return Promise.reject(new Error("Queue overflow"));
    }
    
    if (this.queue.length === this.warnQueueSize) {
      this.logger.warn("Queue entered warning zone", {
        size: this.queue.length,
      });
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) continue;

      try {
        const result = await item.task();
        item.resolve(result);
      } catch (err) {
        item.reject(err);
      }
      
      if (this.queue.length >= this.warnQueueSize) {
        const delay = Math.min(this.queue.length / 10, 50);

        this.logger.debug("Applying backpressure delay", {
          delay,
          queueSize: this.queue.length,
        });

        await new Promise(res => setTimeout(res, delay));
      }
      
    }

    this.isProcessing = false;
  }
}