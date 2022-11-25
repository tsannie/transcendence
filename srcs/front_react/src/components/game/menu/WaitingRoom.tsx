import { useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/AuthContext";
import { RoomStatus } from "../const/const";
import { GameContext, GameContextType } from "../../../contexts/GameContext";

export default function WaitingRoom() {
  const { user } = useContext(AuthContext);
  const { room, setRoom, socket } = useContext(GameContext) as GameContextType;

  function leaveRoom() {
    if (room?.status === RoomStatus.WAITING) {
      setRoom(null);
      socket?.emit("leaveGameRoom", room.id);
      toast.success("Room left !");
    }
  }

  return (
    <div className="game">
      <h2> you are : {user?.username} </h2>
      <p> waiting opponent</p>
      <button onClick={leaveRoom}>leave waiting room</button>
    </div>
  );
}
