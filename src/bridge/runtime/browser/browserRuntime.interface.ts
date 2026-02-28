
export interface IBrowserRuntime {
    launchPage(pageId: string , url:string): Promise<void>;
    closePage(pageId:string): Promise<void>;
    evaluate<T>(pageId:string, fn:(...args:any[]) => T , ...args:any[]):Promise<T>;
}