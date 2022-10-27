import { useContext, useEffect } from "react";
import { socket } from "../Game";
import { GameContext, RoomStatus } from "../GameContext";
import { GameWaitPlayerReady } from "./GameWaitPlayer";

export default function GameCreationSettings(props: any) {

  const game = useContext(GameContext);


  function leaveRoom() {
    if (game.status === RoomStatus.WAITING) {
      game.setStatus(RoomStatus.EMPTY);

      game.setim_p2(false);
      game.setRoom("");

      socket.emit("leaveGameRoom", game.room);
    }
  }

  console.log("game.status in GameCreationSettings: ", game.status);
  return (
    <div className="queues">
      <h2> you are : {game.my_id} </h2>

      <p> waiting for opponent in room {game.room} </p>
      <button onClick={leaveRoom}>leave room {game.room}</button>
    </div>
  );
}

