import { useContext, useEffect } from "react";
import { socket } from "../Game";
import { GameContext, RoomStatus } from "../GameContext";
import { GameWaitPlayerReady } from "./GameWaitPlayer";

export default function GameCreationSettings(props: any) {

  const game = useContext(GameContext);

  function StartGame(rom: string) {
    socket.emit("startGameRoom", rom);
  }

  // If the players are ready, start the game

  useEffect(() => {
    socket.on("readyGame", (theroom: any) => {
      if (
        (theroom.p2 === socket.id && theroom.p2_ready === true) ||
        (theroom.p1 === socket.id && theroom.p1_ready === true)
      )
         props.setimready(true);
      if (
        (theroom.p1 !== socket.id && theroom.p1_ready === true) ||
        (theroom.p2 !== socket.id && theroom.p2_ready === true)
      )
        props.setopready(true);
      if (theroom.p1_ready === true && theroom.p2_ready === true) {
          game.setRoom(theroom.room_name);
          props.setgamestart(true);
        if (theroom.p1 === socket.id) {
          StartGame(theroom.room_name);
        }
      }
    });

  }, [socket]);


  console.log("game.status in GameCreationSettings: ", game.status);
  return (
    <div className="queues">
      <h2> you are : {props.my_id} </h2>

      <p> waiting for opponent in room {game.room} </p>
      <button onClick={props.deleteGameRoom}>leave room {game.room}</button>
{/*       {game.status === RoomStatus.PLAYING &&
          <GameWaitPlayerReady
          //my_id={props.my_id}
          gamestart={props.gamestart}
          room={game.room}
          im_p2={game.im_p2}
          canvasRef={props.canvasRef}

          deleteGameRoom={props.deleteGameRoom}
          opready={props.opready}
          imready={props.imready}
          setimready={props.setimready}
          setopready={props.setopready}
          op_id={game.op_id}
        />
      } */}
    </div>
  );
}

