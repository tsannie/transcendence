import { useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { SocketGameContext } from "../../../contexts/SocketGameContext";
import { GameContext, RoomStatus } from "../GameContext";

export default function WaitingRoom() {

  const game = useContext(GameContext);
  const socket = useContext(SocketGameContext);
  const { user } = useContext(AuthContext);

  function leaveRoom() {
    if (game.status === RoomStatus.WAITING) {
      game.setStatus(RoomStatus.EMPTY);

      game.setisP2(false);
      game.setRoom("");
      socket.emit("leaveGameRoom", game.room);
    }
  }

  //console.log("game.status in WaitingRoom: ", game.status);
  return (
    <div className="queues">
      <h2> you are : {user?.username} </h2>

      <p> waiting opponent</p>
      <button onClick={leaveRoom}>leave waiting room</button>
    </div>
  );
}

