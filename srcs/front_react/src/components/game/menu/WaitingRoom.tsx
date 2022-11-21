import { useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/AuthContext";
import { SocketGameContext } from "../../../contexts/SocketGameContext";
import { RoomStatus } from "../const/const";
import { GameContext } from "../GameContext";

export default function WaitingRoom() {

  const game = useContext(GameContext);
  const socket = useContext(SocketGameContext);
  const { user } = useContext(AuthContext);

  function leaveRoom() {
    if (game.status === RoomStatus.WAITING) {
      game.setStatus(RoomStatus.EMPTY);
      game.setisP2(false);
      game.setRoom("");
      socket?.emit("leaveGameRoom", game.room);
      toast.success("Room left !");
    }
  }

  return (
    <div className="queues">
      <h2> you are : {user?.username} </h2>
      <p> waiting opponent</p>
      <button onClick={leaveRoom}>leave waiting room</button>
    </div>
  );
}