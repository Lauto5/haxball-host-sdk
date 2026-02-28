
export interface APIInjector {
    __dispatchEvent: (eventName: string, ...args: any[]) => void;
}