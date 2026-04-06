import { BrowserResponse } from "../../responses/browserResponse.interface";

import { RequestProcess } from "./requestProcess.interface";

export class SimpleRequestQueue implements RequestProcess {

  
  queue: Array<{
    task: () => Promise<BrowserResponse>;
    resolve: (value: BrowserResponse) => void;
    reject: (reason?: any) => void;
  }> = [];
  
  isProcessing = false;
  maxQueueSize: number;

  constructor(maxQueueSize = 1000) {
    this.maxQueueSize = maxQueueSize;
  }

  add(task: () => Promise<BrowserResponse>): Promise<BrowserResponse> {
    if (this.queue.length >= this.maxQueueSize) {
      return Promise.reject(new Error("Queue overflow"));
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
    }

    this.isProcessing = false;
  }
}