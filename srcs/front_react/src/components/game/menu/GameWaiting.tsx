import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AuthContext,
  AuthContextType,
  User,
} from "../../../contexts/AuthContext";
import { RoomStatus } from "../const/const";
import { GameContext, GameContextType } from "../../../contexts/GameContext";

export default function GameWaiting() {
  const { room, setRoom, socket, timeQueue } = useContext(
    GameContext
  ) as GameContextType;

  function leaveRoom() {
    if (room && room.status === RoomStatus.WAITING && socket) {
      socket.emit("leaveRoom", room.id);
      setRoom(null);
    }
  }

  useEffect(() => {
    console.log("room", room);
  }, [room]);

  return (
    <div className="waiting">
      <div className="waiting__search">
        <div className="waiting__search__title">
          <h3>{room?.private_room ? "pending" : "searching"}</h3>
          <div className="dot">
            <h3 id="dot1">.</h3>
            <h3 id="dot2">.</h3>
            <h3 id="dot3">.</h3>
          </div>
        </div>
        <div className="waiting__search__time">
          <span id="minutes">
            {("0" + Math.floor((timeQueue / 60000) % 60)).slice(-2)}:
          </span>
          <span id="sec">
            {("0" + Math.floor((timeQueue / 1000) % 60)).slice(-2)}
          </span>
        </div>
      </div>
      <button onClick={leaveRoom}>cancel</button>
    </div>
  );
}
