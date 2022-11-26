import React, { useContext } from "react";
import { toast } from "react-toastify";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { GameMode } from "../const/const";
import { ICreateRoom } from "../types";

function GameMatchmaking() {
  const { socket, room } = useContext(GameContext) as GameContextType;

  const joinMatchmaking = (data: ICreateRoom) => {
    if (!room) {
      socket?.emit("matchmaking", data);
    }
  };
  const handleMatchClassic = () => {
    joinMatchmaking({
      mode: GameMode.PONG_CLASSIC,
    });
  };

  const handleMatchTrans = () => {
    joinMatchmaking({
      mode: GameMode.PONG_TRANS,
    });
  };

  return (
    <div className="matchmaking">
      <div className="matchmaking__title">
        <h3>ranked games</h3>
      </div>
      <div className="matchmaking__content">
        <button onClick={handleMatchClassic}>classic</button>
        <button onClick={handleMatchTrans}>transcendence</button>
      </div>
    </div>
  );
}

export default GameMatchmaking;