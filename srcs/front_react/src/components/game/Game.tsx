import React, { useContext } from "react";
import io from "socket.io-client";
import GameMenu from "./menu/Menu";
import { GameContext, GameProvider, RoomStatus } from "./GameContext";
import { AuthProvider } from "../../contexts/AuthContext";
import { SocketGameProvider } from "../../contexts/SocketGameContext";

/* export const socket = io("http://localhost:4000/game");

socket.on("connect_error", (err) => {
  console.log(`|||||||||||connect_error due to ${err.message}`);
}); */

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
