import { BrowserResponse } from "../../responses/browserResponse.interface";

import { IRequestProcess } from "./requestProcess.interface";

import { ILogger , IMetrics, ITrace, Observability } from "../../../../observability";

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
  
  private metrics: IMetrics;
  
  constructor(obs: Observability, warnQueueSize = 1000, maxQueueSize = 5000) {
    
    this.warnQueueSize = warnQueueSize;
    
    this.maxQueueSize = maxQueueSize;
    
    this.logger = obs.createScopeLogger("SimpleRequestQueue");
    
    this.metrics = obs.createScopeMetrics({ queue: "simple_request_queue" });
  }

  add(task: () => Promise<BrowserResponse>): Promise<BrowserResponse> {

    
    if (this.queue.length >= this.maxQueueSize) {
      
      this.logger.error("Queue overflow");
      
      this.metrics.increment("queue.overflow");
      
      return Promise.reject(new Error("Queue overflow"));
      
    }
    
    if (this.queue.length === this.warnQueueSize) {
      
      this.logger.warn("Queue entered warning zone", {
        
        size: this.queue.length,
        
      });
      
      this.metrics.increment("queue.warn");
      
    }

    return new Promise((resolve, reject) => {
      
      this.queue.push({ task, resolve, reject });
      
      this.metrics.gauge("queue.size", this.queue.length);
      
      this.processQueue();
      
    });
    
  }

  async processQueue(): Promise<void> {
    
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      
      const item = this.queue.shift();
      
      if (!item) continue;
      
      const start = Date.now();

      try {
        
        const result = await item.task();
        
        item.resolve(result);
        
        this.metrics.increment("queue.task.success");
        
      } catch (err) {
        
        item.reject(err);
        
        this.metrics.increment("queue.task.error");
        
      }
      
      const duration = Date.now() - start;
      
      this.metrics.observe("queue.task.duration", duration);
      
      if (this.queue.length >= this.warnQueueSize) {
        
        const delay = Math.min(this.queue.length / 10, 50);
        
        this.metrics.observe("queue.delay", delay);
        
        this.metrics.gauge("queue.size", this.queue.length);

        await new Promise(res => setTimeout(res, delay));
        
      }
      
    }

    this.isProcessing = false;
    
    this.metrics.gauge("queue.size", this.queue.length);
    
  }
  
}