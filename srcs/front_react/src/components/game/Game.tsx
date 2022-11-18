import React, { useContext } from "react";
import GameMenu from "./menu/Menu";
import { GameContext, GameProvider } from "./GameContext";
import { SocketGameProvider } from "../../contexts/SocketGameContext";
import { RoomStatus } from "./const/const";
import { GameRender } from "./render/Render";
import WaitingRoom from "./menu/WaitingRoom";

function GameBody() {
  const game = useContext(GameContext);

  switch (game.status) {
    case RoomStatus.EMPTY:
      return <GameMenu />;
    case RoomStatus.WAITING:
      return <WaitingRoom />;
    case RoomStatus.PLAYING:
      return <GameRender />;
    default:
      return <></>;
  }
}

export default function Game() {
  return (
    <div className="game">
      <SocketGameProvider>
        <GameProvider>
          <GameBody />
        </GameProvider>
      </SocketGameProvider>
    </div>
  );
}
