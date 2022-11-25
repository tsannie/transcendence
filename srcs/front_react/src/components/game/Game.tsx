import React, { useContext } from "react";
import GameMenu from "./menu/Menu";
import { GameRender } from "./render/Render";
import WaitingRoom from "./menu/WaitingRoom";
import { GameMode, RoomStatus } from "./const/const";
import { GameContext, GameContextType } from "../../contexts/GameContext";
import "./game.style.scss";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { ICreateRoom } from "./types";
import { toast } from "react-toastify";
import GameDuel from "./menu/GameDuel";
import GameCurrent from "./menu/GameCurrent";
import GameContentHeader from "./menu/GameContentHeader";
import GameMatchmaking from "./menu/GameMatchmaking";

export default function Game() {
  const { socket, room } = useContext(GameContext) as GameContextType;
  const { user } = useContext(AuthContext) as AuthContextType;

  /*if (room) {
    if (room.status === RoomStatus.WAITING) {
      return <WaitingRoom />;
    } else {
      return <GameRender />;
    }
  } else {
    return <GameMenu />;
  }*/

  /*<div className="GameMenu">
  <h2> you are : {user?.username} </h2>
  <br />
  <button onClick={matchmakingClassic}>pong classic</button>
  <br />
  <br />
  <button onClick={matchmakingTrans}>pong transcendence</button>
</div>*/

  return (
    <div className="game">
      <div className="game__menu">
        <GameDuel />
        <GameCurrent />
      </div>
      <div className="game__content">
        <GameContentHeader />
        <GameMatchmaking />
      </div>
    </div>
  );
}
