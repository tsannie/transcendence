import React, { useContext, useState } from "react";
import GameMenu from "./menu/Menu";
import { GameRender } from "./render/Render";
import { GameMode, RoomStatus } from "./const/const";
import { GameContext, GameContextType } from "../../contexts/GameContext";
import "./game.style.scss";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { ICreateRoom } from "./types";
import { toast } from "react-toastify";
import GameCurrent from "./menu/GameCurrent";
import GameContentHeader from "./menu/GameContentHeader";
import GameMatchmaking from "./menu/GameMatchmaking";
import GameWaiting from "./menu/GameWaiting";
import GameAmical from "./menu/GameAmical";

export default function Game() {
  const { room, displayRender } = useContext(GameContext) as GameContextType;
  const { user } = useContext(AuthContext) as AuthContextType;

  if (displayRender && room) return <GameRender />;
  else
    return (
      <div className="game" id="menu">
        <div className="game__menu">
          <GameAmical />
          <GameCurrent />
        </div>
        <div className="game__content">
          <GameContentHeader />
          {room && room.status === RoomStatus.WAITING ? (
            <GameWaiting />
          ) : (
            <GameMatchmaking />
          )}
        </div>
      </div>
    );
}
