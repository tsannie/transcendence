import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { SocketGameContext } from "../../../contexts/SocketGameContext";
import { GameMode, RoomStatus } from "../const/const";
import { GameContext } from "../GameContext";
import { ICreateRoom } from "../types";

export default function GameMenu() {

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
        <h2> you are : {user?.username} </h2>
        <br />
        <button onClick={createGameRoom}>PONG 1972</button>
        <br/>
        <br/>
        <button onClick={createGameRoomTRANS}>PONG TRANSCENDENCE</button>
      </div>
    }
    </div>
  );
}