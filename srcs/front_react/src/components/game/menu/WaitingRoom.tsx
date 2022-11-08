import { useContext, useEffect } from "react";
import { socket } from "../Game";
import { GameContext, RoomStatus } from "../GameContext";

export default function WaitingRoom() {

  const game = useContext(GameContext);


  function leaveRoom() {
    if (game.status === RoomStatus.WAITING) {
      game.setStatus(RoomStatus.EMPTY);

      game.setim_p2(false);
      game.setRoom("");
      socket.emit("leaveGameRoom", game.room);
    }
  }

  //console.log("game.status in WaitingRoom: ", game.status);
  return (
    <div className="queues">
      <h2> you are : {game.my_id} </h2>

      <p> waiting opponent</p>
      <button onClick={leaveRoom}>leave waiting room</button>
    </div>
  );
}

