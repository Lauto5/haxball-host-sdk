
/**
 * 
 * metrics is used to keep a record of every action of the internal system of the sdk, it is used for statistics.
 * 
 * **example:**
 * 
 * @example
 * ```typescript
 * const metrics: IMetrics = {
 *   increment: (name: string, value?: number, labels?: Record<string, string>) => {
 *    // por ejemplo guardar en una base de datos o archivo.  
 *   },
 *   gauge: (name: string, value: number, labels?: Record<string, string>) => {
 *    // por ejemplo guardar en una base de datos o archivo.  
 *   },
 *   observe: (name: string, value: number, labels?: Record<string, string>) => {
 *    // por ejemplo guardar en una base de datos o archivo.  
 *   },
 * }
 * ```
 * 
 */
export interface IMetrics {
  
  increment(name: string, value?: number, labels?: Record<string, string>): void;
  
  gauge(name: string, value: number, labels?: Record<string, string>): void;
  
  observe(name: string, value: number, labels?: Record<string, string>): void;
  
}