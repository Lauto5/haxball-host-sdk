export {}

declare global {
    interface Window {
        HBInit: (config: any) => any;
        __room: any; // Puedes definir un tipo más específico si lo deseas
    }
}