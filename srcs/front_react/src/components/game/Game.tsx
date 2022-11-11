import React, { useContext } from "react";
import GameMenu from "./menu/Menu";
import { GameContext, GameProvider, RoomStatus } from "./GameContext";
import { SocketGameProvider } from "../../contexts/SocketGameContext";

export default function Game() {

  const game = useContext(GameContext);

      return (
      <SocketGameProvider>
        <GameProvider>
            <div className="game">
              { game.status === RoomStatus.EMPTY && <GameMenu /> }
            </div>
        </GameProvider>
      </SocketGameProvider>
    );
}
