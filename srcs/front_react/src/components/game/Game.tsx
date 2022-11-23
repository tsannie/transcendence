import React, { useContext } from "react";
import GameMenu from "./menu/Menu";
import { GameRender } from "./render/Render";
import WaitingRoom from "./menu/WaitingRoom";
import { RoomStatus } from "./const/const";
import { GameContext, GameProvider } from "../../contexts/GameContext";

function GameBody() {
  const { room } = useContext(GameContext);

  switch (room ? room.status : RoomStatus.EMPTY) {
    case RoomStatus.WAITING:
      return <WaitingRoom />;
    case RoomStatus.PLAYING:
      return <GameRender />;
    default:
      return <GameMenu />;
  }
}

export default function Game() {
  return (
    <div className="game">
      <GameProvider>
        <GameBody />
      </GameProvider>
    </div>
  );
}
