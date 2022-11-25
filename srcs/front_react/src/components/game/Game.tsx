import React, { useContext } from "react";
import { GameRender } from "./render/Render";
import { GameContext, GameProvider } from "../../contexts/GameContext";

function GameBody() {
  const { room } = useContext(GameContext);

  return <GameRender />;

  /*if (room) {
    if (room.status === RoomStatus.WAITING) {
      return <WaitingRoom />;
    } else {
      return <GameRender />;
    }
  } else {
    return <GameMenu />;
  }*/
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
