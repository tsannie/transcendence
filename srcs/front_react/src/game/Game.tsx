import React, { createRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { GamePlayer_p1_p2 } from "./gameReact/GameReact";
import { GameSpectator } from "./gameSpectator/GameSpectator";
import GameMenu from "./gameInitialisation/GameMenu";
import { GameWaitPlayerReady } from "./gameInitialisation/GameWaitPlayer";
import GameCreationSettings from "./gameInitialisation/GameCreationSettings";
import { GameMenuSpectator } from "./gameSpectator/GameMenuSpectator";
import data from "./gameReact/data";

/* export let {
  ballObj,
  gameSpecs,
  player_p1,
  player_p2,
  paddleProps_p1,
  paddleProps_p2,
} = data;
 */

export enum RoomStatus {
  EMPTY = 0,
  WAITING = 1,
  PLAYING = 2,
  CLOSED = 3,
}

export const socket = io("http://localhost:4000/game");

socket.on("connect_error", (err) => {
  console.log(`|||||||||||connect_error due to ${err.message}`);
});

  /*   
  TODOP FIX GAME
  TODOP EGALISER PADDLE 

  TODOP NEW MAP IN GAME
  TODOP RESPONSIVE GAME
  TODOP FONT GAME STYLE

  TODOP LINK USER TO GAMES
  */


export default function Game() {
  const [status, setStatus] = useState(RoomStatus.EMPTY);
  const [room, setRoom] = useState("");
  const [my_id, setmy_id] = useState(socket.id);
  const [op_id, setop_id] = useState("2");
  const [im_p2, setim_p2] = useState(false);
  const [islookingroom, setisLookingRoom] = useState(false);
  const [isfull, setisFull] = useState("");
  const [isinroom, setisinroom] = useState(false);
  const [imready, setimready] = useState(false);
  const [opready, setopready] = useState(false);
  const [gamestart, setgamestart] = useState(false);
  const [Specthegame, setSpecthegame] = useState(false);
  const [Room_name_spec, setRoom_name_spec] = useState("");
  
  // useEffect reinint the game when the player leave the room or the game is over or the player give up

  useEffect(() => {
    socket.on("leftRoom", (theroom: any) => {
      setStatus(theroom.status);

      setopready(false);
      setimready(false);
      setgamestart(false);
      setop_id("");
    });

    socket.on("leftRoomEmpty", () => {
      setStatus(RoomStatus.EMPTY);   
      setopready(false);
      setimready(false);
      setgamestart(false);
      setisinroom(false);
      setop_id("");
    });
    setisFull("");
    socket.on("roomFull", (theroom: any) => {
      setisFull("This ROOM IS FULL MATE");
    });
  }, [socket]);

  function deleteGameRoom() {
    if (isinroom === true) {
      setisinroom(false);
      setgamestart(false);
      setimready(false);
      setopready(false);
      setim_p2(false);
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
      <GamePlayer_p1_p2
        setRoom={setRoom}
        //setgamestart={setgamestart}
        //my_id={my_id}
        //op_id={op_id}
        im_p2={im_p2}
        imready={imready}
        opready={opready}
        //setimready={setimready}
        //setopready={setopready}
        room={room}
        canvasRef={canvasRef}
        //deleteGameRoom={deleteGameRoom}
      />
    );
  } else if (status === RoomStatus.PLAYING && isinroom) {
    return (
      <GameWaitPlayerReady
        my_id={my_id}
        room={room}
        im_p2={im_p2}
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
        setStatus={setStatus}
        setisinroom={setisinroom}
        setop_id={setop_id}
        setim_p2={setim_p2}
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
