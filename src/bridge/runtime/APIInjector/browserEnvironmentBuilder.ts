import { RoomConfig } from "../../../types/haxball";

export class BrowserEnvironmentBuilder {
    buildteste() {
        return () => {
            window.__enviroument = {
                calculate(num: number, num1: number) {
                    return num + num1;
                }
            }
        }
    }
  build(){
      return () => {
          window.__hb__runtime = {
              room: null,
              
              saludar() {
                  console.log("HOLA HBRUNTIME");
              },
              
              init(config: RoomConfig): void {
                  console.log("existe HBInit en el entorno : ", typeof (window as any).HBInit === "function");
                  this.room = (window as any).HBInit(config);  
              },
              
              exec(method, args){
                  if (!this.room) throw new Error("room not initialized");
                  const fn = this.room[method];
                  if (typeof fn !== "function") {
                      throw new Error(method + "not found");
                  }
                  return fn(...args);
              }
        }
      }
  }
    
}