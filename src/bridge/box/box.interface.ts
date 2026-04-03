export interface IBox {
  execute(method: string, args: any[]): Promise<any>;
}