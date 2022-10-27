import { createRef, useContext, useEffect, useState } from "react";
import { socket } from "../Game";
import { GameContext, RoomStatus } from "../GameContext";
import { GamePlayer_p1_p2 } from "../gameReact/GameReact";
import { GameMenuSpectator } from "../gameSpectator/GameMenuSpectator";
import GameCreationSettings from "./GameCreationSettings";
import { GameWaitPlayerReady } from "./GameWaitPlayer";

export default function GameMenu(props: any) {

  const game = useContext(GameContext);


  // useEffect reinint the game when the player leave the room or the game is over or the player give up

  function createFastGameRoom() {
    game.setRoom("");
    if ( game.status === RoomStatus.EMPTY)
      socket.emit("createGameRoom",  game.room);
  }

  console.log("game.status",  game.status);
  return (
    <div className="Game">
      {game.status === RoomStatus.EMPTY &&
      <div className="GameMenu">
        <h2> you are : {game.my_id} </h2>
        <br />
        <button onClick={createFastGameRoom}>FAST GAME</button>
      </div>
    }

    {game.status === RoomStatus.WAITING && <GameCreationSettings />}
    {game.status === RoomStatus.PLAYING && <GamePlayer_p1_p2 />}
    </div>
  );
}