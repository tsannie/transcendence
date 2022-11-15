import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { SocketGameContext } from "../../../contexts/SocketGameContext";
import { GameMode } from "../const/const";
import { GameContext, RoomStatus } from "../GameContext";
import { GamePlayer_p1_p2 } from "../render/Render";
import { ICreateRoom } from "../types";
import WaitingRoom from "./WaitingRoom";

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
    {game.status === RoomStatus.WAITING && <WaitingRoom />}
    {game.status === RoomStatus.PLAYING && <GamePlayer_p1_p2 />}
    </div>
  );
}