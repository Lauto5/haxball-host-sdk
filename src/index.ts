import { HaxballHostSDK } from "./core/haxball_host_sdk";



const hbh:HaxballHostSDK = new HaxballHostSDK();

// (desarrollo) probar el bridge, luego borrar.
hbh.testBridge().catch(console.error);