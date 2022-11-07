import { useContext } from "react";
import { socket } from "../Game";
import { GameContext, RoomStatus } from "../GameContext";
import { GamePlayer_p1_p2 } from "../render/Render";
import WaitingRoom from "./WaitingRoom";

export default function GameMenu(props: any) {

  const game = useContext(GameContext);

  function createFastGameRoom() {
    if (game.status === RoomStatus.EMPTY)
      socket.emit("createGameRoom", game.room);
  }

  return (
    <div className="Game">
      {game.status === RoomStatus.EMPTY &&
      <div className="GameMenu">
        <h2> you are : {game.my_id} </h2>
        <br />
        <button onClick={createFastGameRoom}>PONG 1972</button>
        <br/>
        <br/>
        <button onClick={createFastGameRoom}>PONG TRANSCENDENCE</button>
      </div>
    }

    {game.status === RoomStatus.WAITING && <WaitingRoom />}
    {game.status === RoomStatus.PLAYING && <GamePlayer_p1_p2 />}
    </div>
  );
}