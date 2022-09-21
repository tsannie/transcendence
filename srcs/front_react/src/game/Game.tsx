import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import io from "socket.io-client";
import data from "./gameReact/data";
import { The_whole_game } from "./gameReact/GameReact";
import GameMenu from "./component/GameMenu";
import { GameWaitPlayerReady } from "./component/GameWaitPlayer";
import { GamePlayer_left } from "./gameReact/GamePlayerLeft";
import { GamePlayer_right } from "./gameReact/GamePlayerRight";
import GameCreationSettings from "./component/GameCreationSettings";

export const socket = io("http://localhost:4000/game");

socket.on("connect_error", (err) => {
  console.log(`|||||||||||connect_error due to ${err.message}`);
});

export let {
  ballObj,
  player_left,
  player_right,
  paddleProps_left,
  paddleProps_right,
} = data;

export default function Game() {
  const [nbrconnect, setnbrconnect] = useState(0);
  const [room, setRoom] = useState("");
  const [lookingroom, setLookingRoom] = useState("");
  const [color_ready, setColor_ready] = useState("");
  const [my_id, setmy_id] = useState(socket.id);
  const [op_id, setop_id] = useState("2");
  const [im_right, setim_right] = useState(false);
  const [islookingroom, setisLookingRoom] = useState(false);
  const [isfull, setisFull] = useState("");
  const [isinroom, setisinroom] = useState(false);
  const [imready, setimready] = useState(false);
  const [opready, setopready] = useState(false);
  const [PP_empty, setPP_empty] = useState("");
  const [gameover, setgameover] = useState(false);
  const [gamestart, setgamestart] = useState(false);
  const [listGame, setListGame] = useState<string[]>([]);

  const store = {
    nbrconnect: nbrconnect,
    room: room,
    lookingroom: lookingroom,
    color_ready: color_ready,
    my_id: my_id,
    op_id: op_id,
    im_right: im_right,
    islookingroom: islookingroom,
    isfull: isfull,
    isinroom: isinroom,
    imready: imready,
    opready: opready,
    PP_empty: PP_empty,
    gameover: gameover,
    gamestart: gamestart,
    listGame: listGame,

    setnbrconnect: setnbrconnect,
    setRoom: setRoom,
    setLookingRoom: setLookingRoom,
    setColor_ready: setColor_ready,
    setmy_id: setmy_id,
    setop_id: setop_id,
    setim_right: setim_right,
    setisLookingRoom: setisLookingRoom,
    setisFull: setisFull,
    setisinroom: setisinroom,
    setimready: setimready,
    setopready: setopready,
    setPP_empty: setPP_empty,
    setgameover: setgameover,
    setgamestart: setgamestart,
    setListGame: setListGame,
  };

  ////////////////////////////////////////////////////
  // DELETE / LEAVE ROOM
  ////////////////////////////////////////////////////

  useEffect(() => {
    socket.on("leftRoom", (theroom: any) => {
      setnbrconnect(theroom.nbr_co);
      setopready(false);
      setimready(false);
      setgamestart(false);
      setop_id("");

      if (theroom.set.set_p1 && theroom.set.set_p2) {
        player_left.name = theroom.set.set_p1.name;
        player_left.score = theroom.set.set_p1.score;
        player_left.won = theroom.set.set_p1.won;

        player_right.name = theroom.set.set_p1.name;
        player_right.score = theroom.set.set_p1.score;
        player_right.won = theroom.set.set_p1.won;
      }

      ballObj.init_ball_pos = false;
      ballObj.first_col = false;
      
    });
    socket.on("leftRoomEmpty", () => {
      setnbrconnect(0);
      setopready(false);
      setimready(false);
      setop_id("");
    });

    setisFull("");
    setmy_id(socket.id);
    socket.on("roomFull", (theroom: any) => {
      setisFull("This ROOM IS FULL MATE");
      console.log("THIS ROOM IS FULL");
    });
  }, [socket]);

  function deleteGameRoom() {
    if (isinroom === true) {
      setisinroom(false);
      setgameover(true);
      setgamestart(false);

      ballObj.init_ball_pos = false;
      ballObj.first_col = false;
      setColor_ready("black");
      socket.emit("leaveGameRoom", room);
      setRoom("");
    }
  }

  ////////////////////////////////////////////////////
  //// REACT GAME
  ////////////////////////////////////////////////////

  const canvasRef = useRef(null);
  The_whole_game(canvasRef);

  ////////////////////////////////////////////////////


  if (gamestart === true && im_right === true) {
    return (
      <GamePlayer_right
        setRoom={setRoom}
        canvasRef={canvasRef}
        deleteGameRoom={deleteGameRoom}
        gamestart={gamestart}
        im_right={im_right}
        my_id={my_id}
        op_id={op_id}
        room={room}
      />
    );
  } else if (gamestart === true && im_right === false) {
    return (
      <GamePlayer_left
        setRoom={setRoom}
        canvasRef={canvasRef}
        deleteGameRoom={deleteGameRoom}
        gamestart={gamestart}
        im_right={im_right}
        my_id={my_id}
        op_id={op_id}
        room={room}
      />
    );
  } else if (nbrconnect === 2 && isinroom) {
    return (
      <GameWaitPlayerReady
        my_id={my_id}
        room={room}
        deleteGameRoom={deleteGameRoom}
        setColor_ready={setColor_ready}
        color_ready={color_ready}
        opready={opready}
        op_id={op_id}
      />
    );
  } else if (isinroom === true) {
    return (
      <GameCreationSettings my_id={my_id} room={room} deleteGameRoom={deleteGameRoom} />
    );
  } else {
    return <GameMenu store={store} />;
  }
}
