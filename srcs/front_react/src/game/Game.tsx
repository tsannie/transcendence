import React, { createRef, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { GamePlayer_p1_p2 } from "./gameReact/GameReact";
import GameMenu from "./gameInitialisation/GameMenu";
import { GameContext, GameProvider, RoomStatus } from "./GameContext";

export const socket = io("http://localhost:4000/game");

socket.on("connect_error", (err) => {
  console.log(`|||||||||||connect_error due to ${err.message}`);
});

export default function Game() {

  const game = useContext(GameContext);

    console.log("game.status @@@@", game.status);
    return (
      <GameProvider>
        <div className="game">
          { game.status === RoomStatus.EMPTY && <GameMenu /> }
          { game.status === RoomStatus.PLAYING && <GamePlayer_p1_p2/>}
        </div>
      </GameProvider>
    );
}
