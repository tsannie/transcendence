import React, { createContext, useContext, useEffect, useRef, useState} from "react";
import "./Game.css";
import io from "socket.io-client";
import { start } from "repl";
import { render } from "@testing-library/react";
import data from "./BallMouv";
import { syncBuiltinESMExports } from "module";
import {
  hasSelectionSupport,
  wait,
} from "@testing-library/user-event/dist/utils";
import { resolve } from "path";
import {The_whole_game, GameStarted_left, GameStarted_right } from "./GameStarted";
import {GameCreation} from "./GameCreation";
import {The_whole_spectator, GameSpectator} from "./GameSpectator";
import GameInit from "./GameInit";
import { GameWaitReady, The_whole_creation } from "./GameWait";
import The_whole_delete from "./GameDelete";

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
  }
  
  The_whole_delete(store);

  function deleteGameRoom() {
    if (isinroom == true) {
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

  The_whole_creation(store);
  The_whole_spectator(store);
  //Creation_game();


  const canvasRef = useRef(null);
  The_whole_game(canvasRef);

  if (gamestart == true && im_right == true) {
    return (
        <GameStarted_right setRoom={setRoom} canvasRef={canvasRef}
        deleteGameRoom={deleteGameRoom} gamestart={gamestart} im_right={im_right}
        my_id={my_id} op_id={op_id} room={room}/>
    );
  } else if (gamestart == true && im_right == false) {
    return (
        <GameStarted_left setRoom={setRoom} canvasRef={canvasRef} 
        deleteGameRoom={deleteGameRoom} gamestart={gamestart} im_right={im_right}
        my_id={my_id} op_id={op_id} room={room}/>
    );
  } else if (nbrconnect == 2 && isinroom) {
    return (
        <GameWaitReady my_id={my_id} room={room}
        deleteGameRoom={deleteGameRoom} setColor_ready={setColor_ready}
        color_ready={color_ready}
        opready={opready} op_id={op_id} />
    );
  } else if (isinroom == true) {
    return (
        <GameCreation my_id={my_id} room={room} deleteGameRoom={deleteGameRoom}/>
    );
  } else if (islookingroom == true) {
    return (
          <GameSpectator store={store}/>
    );
  } else {
    return (
        <GameInit my_id={my_id} setRoom={setRoom} PP_empty={PP_empty} room={room} isinroom={isinroom} 
        isfull={isfull} setisLookingRoom={setisLookingRoom} />
    );
  }
}
