
export interface BrowserRuntimeHelper {
    existHBInit(): Promise<boolean>;
    getPageState(pageId:string): any; // luego modelar los states de las paginas.
    countBrowserPages(): number;
    // luego pensar que mas hace falta
}