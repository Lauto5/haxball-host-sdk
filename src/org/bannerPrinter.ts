
export class BannerPrinter {
  
  static printBanner(version: string) {
    console.log(`
   __ _____  __ __  _______  __ __
  / // / _ )/ // / / __/ _ \/ //_/
 / _  / _  / _  / _\ \/ // / ,<   
/_//_/____/_//_/ /___/____/_/|_|  
                                     
Haxball Host SDK v${version}
Node: ${process.version}
PID: ${process.pid}`);
  }
  
}