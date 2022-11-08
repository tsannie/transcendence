import { useContext, useState } from "react";
import { socket } from "../Game";
import { GameContext, RoomStatus } from "../GameContext";
import { GamePlayer_p1_p2 } from "../render/Render";
import WaitingRoom from "./WaitingRoom";

enum GameMode {
  PONG_1972 = "1972",
  PONG_TRANS = "TRANS",
}

export default function GameMenu(props: any) {

  const game = useContext(GameContext);
  let game_mode = GameMode.PONG_1972;
  
  function createGameRoom() {
    let data = {
      room : game.room,
      game_mode : game_mode,
    }

    game.setRoom("");
    if (game.status === RoomStatus.EMPTY)
      socket.emit("createGameRoom", data);
  }

  function createGameRoomTRANS() {
    game_mode = GameMode.PONG_TRANS;
    createGameRoom();
  }

  return (
    <div className="Game">
      {game.status === RoomStatus.EMPTY &&
      <div className="GameMenu">
        <h2> you are : {game.my_id} </h2>
        <br />
        <button onClick={createGameRoom}>PONG 1972</button>
        <br/>
        <br/>
        <button onClick={createGameRoomTRANS}>PONG TRANSCENDENCE</button>
      </div>
    }

    {game.status === RoomStatus.WAITING && <WaitingRoom />}
    {game.status === RoomStatus.PLAYING && <GamePlayer_p1_p2 />}
    </div>
  );
}