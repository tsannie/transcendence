import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";
import { RoomStatus } from "../const/const";
import { GameContext, GameContextType } from "../../../contexts/GameContext";

export default function GameWaiting() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { room, setRoom, socket } = useContext(GameContext) as GameContextType;
  const [time, setTime] = useState(0);

  function leaveRoom() {
    if (room?.status === RoomStatus.WAITING) {
      socket?.emit("leaveRoom", room.id);
      setRoom(null);
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setTime((time) => time + 10);
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="waiting">
      <div className="waiting__search">
        <div className="waiting__search__title">
          <h3>searching </h3>
          <div className="dot">
            <h3 id="dot1">.</h3>
            <h3 id="dot2">.</h3>
            <h3 id="dot3">.</h3>
          </div>
        </div>
        <div className="waiting__search__time">
          <span id="minutes">
            {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
          </span>
          <span id="sec">
            {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
          </span>
        </div>
      </div>
      <button onClick={leaveRoom}>cancel</button>
    </div>
  );
}
