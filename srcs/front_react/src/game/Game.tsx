import React, { useEffect, useRef, useState } from "react";
import "./Game.css";
import io from "socket.io-client";
import { start } from "repl";
import { render } from "@testing-library/react";
import {
  BallMouv,
  BallCol_right,
  BallCol_left,
  PaddleMouv_left,
  PaddleMouv_right,
  draw_line,
  draw_score,
} from "./BallMouv";
import data from "./BallMouv";
import { syncBuiltinESMExports } from "module";
import {
  hasSelectionSupport,
  wait,
} from "@testing-library/user-event/dist/utils";
import { resolve } from "path";
import {The_whole_game, GameStarted_left, GameStarted_right } from "./GameStarted";
import {Creation_game, GameCreation, GameWaitReady} from "./GameCreation";
import GameSpectator from "./GameSpectator";
import GameInit from "./GameInit";

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


  function createGameRoom() {
    if (room == "")
      setPP_empty("INVALID ROOM NAME");
    else if (isinroom == false) {
      socket.emit("createGameRoom", room);
    }
  }

  function createFastGameRoom() {
    setRoom("");
    if (isinroom == false) {
      socket.emit("createGameRoom", room);
    }
  }

  // WORK IN PROGRESS !!! WORK IN PROGRESS !!! WORK IN PROGRESS !!! ----------
  function lookthegame() {
    //setisLookingRoom(false);

    console.log(
      "lookthegamelookthegamelookthegamelookthegamelookthegame lookthegame"
    );
    //console.log(listGame)

    console.log("/*/**//*/**/   " + lookingroom);
    socket.emit("lookGameRoom", lookingroom);
  }

  function lookAtAllGameRoom() {
    setisLookingRoom(true);

    console.log("LOOKNIGRROM LOG");
    //console.log(listGame)

    socket.emit("lookAllGameRoom", "lookroom");
  }
  // WORK IN PROGRESS !!! WORK IN PROGRESS !!! WORK IN PROGRESS !!! ----------

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

  // WORK IN PROGRESS !!! WORK IN PROGRESS !!! WORK IN PROGRESS !!! ----------
  function leavelookingroom() {
    setisLookingRoom(false);
    setLookingRoom("");
    console.log("list when living '" + listGame);
    setListGame([]);
    console.log("list when living then '" + listGame);
  }
  // WORK IN PROGRESS !!! WORK IN PROGRESS !!! WORK IN PROGRESS !!! ----------

  function ReadyGame() {
    setColor_ready("green");
    socket.emit("readyGameRoom", room);
  }

  function StartGame(rom: string) {
    socket.emit("startGameRoom", rom);
  }

  useEffect(() => {
    socket.on("readyGame", (theroom) => {
      setColor_ready("green");
      if (
        (theroom.p2 == socket.id && theroom.p2_ready == true) ||
        (theroom.p1 == socket.id && theroom.p1_ready == true)
      )
        setimready(true);
      if (
        (theroom.p1 != socket.id && theroom.p1_ready == true) ||
        (theroom.p2 != socket.id && theroom.p2_ready == true)
      )
        setopready(true);
      if (theroom.p1_ready == true && theroom.p2_ready == true) {
        setRoom(theroom.room_name);
        StartGame(theroom.room_name);
        setgamestart(true);
      }
    });

    socket.on("joinedRoom", (theroom) => {
      setnbrconnect(theroom.nbr_co);
      setisinroom(true);
      setRoom(theroom.room_name);

      if (theroom.p2 == socket.id) {
        setop_id(theroom.p1);
        setim_right(true);
      } else if (theroom.p1 == socket.id) {
        setop_id(theroom.p2);
        setim_right(false);
      }
    });

    socket.on("getAllGameRoom", (theroom: Map<any, any>) => {
      console.log("getAllGameRoom watch client side");

      console.log("1 socker");

      for (const [key, value] of Object.entries(theroom)) {
        console.log("rooma are : [" + key + "][" + "]");
      }

      console.log("2 socket");
    });

    socket.on("leftRoom", (theroom) => {
      setnbrconnect(theroom.nbr_co);
      setopready(false);
      setimready(false);
      setgamestart(false);
      //console.log("LEFT ROON")
      setop_id("");

      if (theroom.set.set_p1 && theroom.set.set_p2) {
        player_left.name = theroom.set.set_p1.name;
        player_left.score = theroom.set.set_p1.score;
        player_left.won = theroom.set.set_p1.won;

        player_right.name = theroom.set.set_p1.name;
        player_right.score = theroom.set.set_p1.score;
        player_right.won = theroom.set.set_p1.won;
      }
    });

    socket.on("leftRoomEmpty", () => {
      setnbrconnect(0);
      setopready(false);
      setimready(false);
      setop_id("");
    });

    setisFull("");
    setmy_id(socket.id);
    socket.on("roomFull", (theroom) => {
      setisFull("This ROOM IS FULL MATE");
      console.log("THIS ROOM IS FULL");
    });
  }, [socket]);


  Creation_game();


  const canvasRef = useRef(null);
  The_whole_game(canvasRef);

  if (gamestart == true && im_right == true) {
    return (
      <div>
        <GameStarted_left setRoom={setRoom} canvasRef={canvasRef}
        deleteGameRoom={deleteGameRoom} gamestart={gamestart} im_right={im_right}
        my_id={my_id} op_id={op_id} room={room}/>
      </div>
    );
  } else if (gamestart == true && im_right == false) {
    return (
      <div>
        <GameStarted_right setRoom={setRoom} canvasRef={canvasRef} 
        deleteGameRoom={deleteGameRoom} gamestart={gamestart} im_right={im_right}
        my_id={my_id} op_id={op_id} room={room}/>
      </div>
    );
  } else if (nbrconnect == 2 && isinroom) {
    return (
      <div>
        <GameWaitReady my_id={my_id} room={room}
        deleteGameRoom={deleteGameRoom} color_ready={color_ready}
        ReadyGame={ReadyGame} opready={opready} op_id={op_id} />
      </div>
    );
  } else if (isinroom == true) {
    return (
      <div>
        <GameCreation my_id={my_id} room={room} deleteGameRoom={deleteGameRoom}/>
      </div>
    );
  } else if (islookingroom == true) {
    return (
      <div>
        <GameSpectator listGame={listGame} lookthegame={lookthegame}
        leavelookingroom={leavelookingroom} setLookingRoom={setLookingRoom}/>
      </div>
    );
  } else {
    return (
      <div>
        <GameInit my_id={my_id} setRoom={setRoom} createGameRoom={createGameRoom}
        PP_empty={PP_empty} createFastGameRoom={createFastGameRoom}
        isfull={isfull} lookAtAllGameRoom={lookAtAllGameRoom}/>
      </div>
    );
  }
}
