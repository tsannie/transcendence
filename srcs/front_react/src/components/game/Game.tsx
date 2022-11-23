import React, { useContext } from "react";
import GameMenu from "./menu/Menu";
import { GameRender } from "./render/Render";
import WaitingRoom from "./menu/WaitingRoom";
import { RoomStatus } from "./const/const";
import { GameContext, GameProvider } from "../../contexts/GameContext";

function GameBody() {
  const { room } = useContext(GameContext);

  if (room) {
    if (room.status === RoomStatus.WAITING) {
      return <WaitingRoom />;
    } else {
      return <GameRender />;
    }
  } else {
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
