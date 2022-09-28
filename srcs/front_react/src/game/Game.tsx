import React, { createRef, useEffect, useRef, useState } from "react";
import "./Game.css";
import io from "socket.io-client";
import data from "./gameReact/data";
import { GamePlayer_Left_right } from "./gameReact/GameReact";
import { GameSpectator } from "./gameSpectator/GameSpectator";
import GameMenu from "./gameInitialisation/GameMenu";
import { GameWaitPlayerReady } from "./gameInitialisation/GameWaitPlayer";
import GameCreationSettings from "./gameInitialisation/GameCreationSettings";
import { GameMenuSpectator } from "./gameSpectator/GameMenuSpectator";

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
let x = 0;

export default function Game() {
  const [nbrconnect, setnbrconnect] = useState(0);
  const [room, setRoom] = useState("");
  const [my_id, setmy_id] = useState(socket.id);
  const [op_id, setop_id] = useState("2");
  const [im_right, setim_right] = useState(false);
  const [islookingroom, setisLookingRoom] = useState(false);
  const [isfull, setisFull] = useState("");
  const [isinroom, setisinroom] = useState(false);
  const [imready, setimready] = useState(false);
  const [opready, setopready] = useState(false);
  const [gamestart, setgamestart] = useState(false);
  const [Specthegame, setSpecthegame] = useState(false);

  const [Room_name_spec, setRoom_name_spec] = useState("");

  /*   
  TODOP historique game for user
  TODOP FIX GAME
  TODOP EGALISER PADDLE SOURIS
  TODOP NEW MAP IN GAME
  TODOP RESPONSIVE GAME
  */

  useEffect(() => {
    socket.on("leftRoom", (theroom: any) => {
      setnbrconnect(theroom.nbr_co);
      setopready(false);
      setimready(false);
      setgamestart(false);
      setop_id("");
      console.log("leftRoom");

      player_left.name = "empty";
      player_left.score = 0;
      player_left.won = false;

      player_right.name = "empty";
      player_right.score = 0;
      player_right.won = false;

      ballObj.init_ball_pos = false;
      ballObj.first_col = false;
    });

    socket.on("leftRoomEmpty", () => {
      setnbrconnect(0);
      setopready(false);
      setimready(false);
      setgamestart(false);
      setisinroom(false);
      setop_id("");

      player_left.name = "empty";
      player_left.score = 0;
      player_left.won = false;

      player_right.name = "empty";
      player_right.score = 0;
      player_right.won = false;

      ballObj.init_ball_pos = false;
      ballObj.first_col = false;
    });

    setisFull("");
    setmy_id(socket.id);

    socket.on("roomFull", (theroom: any) => {
      setisFull("This ROOM IS FULL MATE");
      console.log("THIS ROOM IS FULL");
    });
  }, [socket]);

  function deleteGameRoom() {
    console.log("deleteGameRoom FROOOONNNNT");
    //ancelAnimationFrame(requestAnimationFrameId);

    if (isinroom === true) {
      setisinroom(false);
      setgamestart(false);
      setimready(false);
      setopready(false);
      setim_right(false);

      ballObj.init_ball_pos = false;
      ballObj.first_col = false;
      socket.emit("leaveGameRoom", room);
      setRoom("");
    }
  }

  ////////////////////////////////////////////////////
  //// REACT GAME
  ////////////////////////////////////////////////////

  let canvasRef = createRef();

  ////////////////////////////////////////////////////

  if (gamestart === true) {
    return (
      <GamePlayer_Left_right
        setRoom={setRoom}
        my_id={my_id}
        op_id={op_id}
        im_right={im_right}
        imready={imready}
        opready={opready}
        setimready={setimready}
        setopready={setopready}
        room={room}
        canvasRef={canvasRef}
        deleteGameRoom={deleteGameRoom}
      />
    );
  } else if (nbrconnect === 2 && isinroom) {
    return (
      <GameWaitPlayerReady
        my_id={my_id}
        room={room}
        deleteGameRoom={deleteGameRoom}
        opready={opready}
        imready={imready}
        setimready={setimready}
        setopready={setopready}
        op_id={op_id}
      />
    );
  } else if (isinroom === true) {
    return (
      <GameCreationSettings
        my_id={my_id}
        room={room}
        deleteGameRoom={deleteGameRoom}
      />
    );
  } else if (islookingroom === true)
    return (
      <GameMenuSpectator
        setisLookingRoom={setisLookingRoom}
        setSpecthegame={setSpecthegame}
        setRoom_name_spec={setRoom_name_spec}
      />
    );
  else if (Specthegame === true)
    return (
      <GameSpectator
        setSpecthegame={setSpecthegame}
        setisLookingRoom={setisLookingRoom}
        Specthegame={Specthegame}
        Room_name_spec={Room_name_spec}
        canvasRef={canvasRef}
      />
    );
  else {
    return (
      <GameMenu
        setimready={setimready}
        setopready={setopready}
        setgamestart={setgamestart}
        setRoom={setRoom}
        setnbrconnect={setnbrconnect}
        setisinroom={setisinroom}
        setop_id={setop_id}
        setim_right={setim_right}
        setisLookingRoom={setisLookingRoom}
        setisFull={setisFull}
        setmy_id={setmy_id}
        room={room}
        isinroom={isinroom}
        my_id={my_id}
        isfull={isfull}
      />
    );
  }
}
