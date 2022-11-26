import React, { useContext, useState } from "react";
import GameMenu from "./menu/Menu";
import { GameRender } from "./render/Render";
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
import GameWaiting from "./menu/GameWaiting";

export default function Game() {
  const { socket, room } = useContext(GameContext) as GameContextType;
  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <div className="game">
      <div className="game__menu">
        <GameDuel />
        <GameCurrent />
      </div>
      <div className="game__content">
        <GameContentHeader />
        {room?.status !== RoomStatus.WAITING ? (
          <GameMatchmaking />
        ) : (
          <GameWaiting />
        )}
      </div>
    </div>
  );
}
