import { HaxballHostSDK } from "./core/haxball_host_sdk";
import { RoomConfig } from "./core/domain";

async function main(roomConfig:RoomConfig) {

  const hbh = new HaxballHostSDK();
  
  const room = await hbh.createRoom(roomConfig);
  
  room.setDefaultStadium("Huge");
  
  room.onPlayerCommand(async (player, message) => {
    
    // obtener el comando !comando args1 args2
    const command: string = message.split(" ")[0];
    const args: string[] = message.split(" ").slice(1);
    
    console.log(`Player ${player.name} sent command: ${message} \n args: ${args}`);
    
    if (command === "!startGame") {
      room.startGame();
    }
    if (command === "!stopGame") {
      room.stopGame();
    }
    if (command === "!giveAdmin") {
      room.setPlayerAdmin(player.id, true);
    }
    if (command === "!takeAdmin") {
      room.setPlayerAdmin(player.id, false);
    }
    
    if (command === "!iceball") {
      // poner en modo ice ball:
      
      room.setDiscProperties(0, { color : 0x0000ff ,ygravity:  10 , xgravity: 10 , xspeed: 9 , yspeed: 9});
      
    }
    
    if (command === "!playerPosition") {
      room.setPlayerDiscProperties(player.id, { x: parseFloat(args[0]), y: parseFloat(args[1]) });
    }
    
    if (command === "!meColor") {
      if (args[0] === "red") {
        room.setPlayerDiscProperties(player.id, { color: 0xff0000 });
      } else if (args[0] === "blue") {
        room.setPlayerDiscProperties(player.id, { color: 0x0000ff });
      } else if (args[0] === "green") {
        room.setPlayerDiscProperties(player.id, { color: 0x00ff00 });
      }
    }
    
  });
  
  // probar restart luego de unos 3 minutos : 
  
  setInterval(() => {
    hbh.restartRoom(roomConfig.roomName);
  }, 1 * 60 * 1000);
  
  
  
}


const roomConfig: RoomConfig = {
  roomName: "Haxball-host-sdk-1",
  maxPlayers: 10,
  public: true,
  noPlayer: true,
  token: "thr1.AAAAAGngH8C_Z1iZoagUVQ.41qCQmFvdBs",
}

main(roomConfig).catch(console.error);


// (desarrollo) probar el bridge, luego borrar.
// hbh.testBridge().catch(console.error);