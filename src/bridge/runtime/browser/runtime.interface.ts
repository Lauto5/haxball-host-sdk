
export interface IRuntime {
    launchPage(pageId: string , url:string, config:RoomConfig): Promise<void>;
    closePage(pageId:string): Promise<void>;
    evaluate<T>(pageId:string, fn:(...args:any[]) => T , ...args:any[]):Promise<T>;
}