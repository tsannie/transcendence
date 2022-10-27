import { createRef, useContext, useEffect, useState } from "react";
import { socket } from "../Game";
import { GameContext, RoomStatus } from "../GameContext";
import { GamePlayer_p1_p2 } from "../gameReact/GameReact";
import { GameMenuSpectator } from "../gameSpectator/GameMenuSpectator";
import GameCreationSettings from "./GameCreationSettings";
import { GameWaitPlayerReady } from "./GameWaitPlayer";

export default function GameMenu(props: any) {
  const [PP_empty, setPP_empty] = useState("");
  const [islookingroom, setisLookingRoom] = useState(false);
  //const [status, setStatus] = useState(RoomStatus.EMPTY);
 //const [room, setRoom] = useState("");
  ///const [my_id, setmy_id] = useState(socket.id);
  const game = useContext(GameContext);

  //const [op_id, setop_id] = useState("2");
  const [im_p2, setim_p2] = useState(false);
  const [isfull, setisFull] = useState("");
  const [isinroom, setisinroom] = useState(false);
  const [imready, setimready] = useState(false);
  const [opready, setopready] = useState(false);
  const [gamestart, setgamestart] = useState(false);

  
  // useEffect reinint the game when the player leave the room or the game is over or the player give up

  useEffect(() => {
    socket.on("leftRoom", (theroom: any) => {
      game.setStatus(theroom.status);

      setopready(false);
      setimready(false);
      setgamestart(false);
      game.setop_id("");
    });

    socket.on("leftRoomEmpty", () => {
      game.setStatus(RoomStatus.EMPTY);   
      setopready(false);
      setimready(false);
      setgamestart(false);
      setisinroom(false);
      game.setop_id("");
    });
    setisFull("");
    socket.on("roomFull", (theroom: any) => {
      setisFull("This ROOM IS FULL MATE");
    });
  }, [socket]);

  function deleteGameRoom() {
    if (isinroom === true) {
      game.setStatus(RoomStatus.EMPTY);
      setisinroom(false);
      setgamestart(false);
      setimready(false);
      setopready(false);
      setim_p2(false);
      socket.emit("leaveGameRoom", game.room);
      game.setRoom("");
    }
  }


  // If the players are ready, start the game

  useEffect(() => {


    socket.on("joinedRoom", (theroom: any) => {

      console.log("theroom.status", theroom.status);
      
      game.setStatus(theroom.status);
       setisinroom(true);
      
       game.setRoom(theroom.room_name);
      if (theroom.p2 === socket.id) {
        game.setop_id(theroom.p1);
         setim_p2(true);
      } else if (theroom.p1 === socket.id) {
        game.setop_id(theroom.p2);
         setim_p2(false);
      }
    });
     setisFull("");
     game.setmy_id(socket.id);
  }, [socket]);

  async function lookAtAllGameRoom() {
    if (islookingroom === false)
      setisLookingRoom(true);
    else
      setisLookingRoom(false);
  }

  // Room Game creation and join

  function createGameRoom() {
    if ( game.room === "")
      setPP_empty("INVALID ROOM NAME");
    else if ( isinroom === false) {
      socket.emit("createGameRoom",  game.room);
    }
  }

  function createFastGameRoom() {
    game.setRoom("");
    if ( isinroom === false)
      socket.emit("createGameRoom",  game.room);
  }

  
  let canvasRef = createRef();

  console.log("game.status",  game.status);
  return (
    <div className="Game">
      {game.status === RoomStatus.EMPTY &&
      <div className="GameMenu">
        <h2> you are : { game.my_id} </h2>

        <h4> Game by room</h4>
        <input
          type="text"
          placeholder="username"
          id="room"
          onChange={(event) => {
            game.setRoom(event.target.value);
          }}
          ></input>
        <button onClick={createGameRoom}>CREATE</button>
        <p>{PP_empty}</p>
        <br />
        <h4> Fast Game</h4>

        <button onClick={createFastGameRoom}>FAST GAME</button>

        <p style={{ color: "red" }}> { isfull} </p>
      </div>
    }
{/*     { game.status === RoomStatus.EMPTY && 
          <div className="GameSpectator">
        <h4>
          Watch a game :
          <button onClick={lookAtAllGameRoom}>SPECTATOR</button>
          {islookingroom &&
            <GameMenuSpectator
              setisLookingRoom={setisLookingRoom}
              canvasRef={canvasRef}
          />
          }
        </h4>
      </div>
      } */}
      { game.status === RoomStatus.WAITING && 
          <GameCreationSettings
            //my_id={my_id}
            deleteGameRoom={ deleteGameRoom}
            gamestart={gamestart}
            isinroom = {isinroom}
            im_p2={im_p2}
            opready={opready}
            imready={imready}
            canvasRef={canvasRef}
            setimready={setimready}
            setopready={setopready}
            />
        }


    {game.status === RoomStatus.PLAYING &&
          <GamePlayer_p1_p2 />
      }



    </div>
  );
}