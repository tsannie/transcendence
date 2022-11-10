import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/AuthContext";
import { SocketGameContext } from "../../../contexts/SocketGameContext";
import { GameContext, RoomStatus } from "../GameContext";
import { GamePlayer_p1_p2 } from "../render/Render";
import WaitingRoom from "./WaitingRoom";

enum GameMode {
  PONG_1972 = "1972",
  PONG_TRANS = "TRANS",
}

interface ICreateRoom {
  room: string,
  mode: GameMode,
}

export default function GameMenu(props: any) {

  const game = useContext(GameContext);
  const socket = useContext(SocketGameContext);
  const { user } = useContext(AuthContext);

  let game_mode = GameMode.PONG_1972;

  function createGameRoom() {
    let data: ICreateRoom = {
      room : game.room,
      mode : game_mode,
    }

    game.setRoom("");
    if (game.status === RoomStatus.EMPTY) {
      socket.emit("createGameRoom", data);
      toast.success("Room created for pong " + game_mode);
    }
  }

  function createGameRoomTRANS() {
    game_mode = GameMode.PONG_TRANS;
    createGameRoom();
  }

  return (
    <div className="Game">
      {game.status === RoomStatus.EMPTY &&
      <div className="GameMenu">
        <h2> you are : {user?.username} </h2>
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