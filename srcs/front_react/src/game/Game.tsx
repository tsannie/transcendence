import React, { createRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { GamePlayer_Left_right } from "./gameReact/GameReact";
import { GameSpectator } from "./gameSpectator/GameSpectator";
import GameMenu from "./gameInitialisation/GameMenu";
import { GameWaitPlayerReady } from "./gameInitialisation/GameWaitPlayer";
import GameCreationSettings from "./gameInitialisation/GameCreationSettings";
import { GameMenuSpectator } from "./gameSpectator/GameMenuSpectator";
import data from "./gameReact/data";

export let {
  ballObj,
  player_left,
  player_right,
  paddleProps_left,
  paddleProps_right,
} = data;

export const socket = io("http://localhost:4000/game");

socket.on("connect_error", (err) => {
  console.log(`|||||||||||connect_error due to ${err.message}`);
});

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

  //# REACT GAME

  //## Testing
  
  
  //1. Open two browser and go to http://localhost:3000/  then press joystick logo to see the game menu !
 //now you can create a Room by id or join a queue with the button `[FAST GAME]`.
  //Then the other browser can join the room by id if created or join the queue with the same button.
  
 //2. When the two players are in the same room they both need to be ready to start the game by pressing the button `[READY ?]`
  //Or they can leave the room by pressing the button `[LEAVE ROOM]`
  
  //3. When the game start you can move your paddle with the mouse.
  //The first player to reach 10 points win the game.
  
  //4. when the game is over or during the game you can press the button `[LEAVE ROOM]` to leave the room

  //5. You can also spectate a game by pressing the button `[SPECTATOR]` and then click the room id of the game you want to spectate.
  
 // ## In this pull request :
  
 // The whole playable game with two different players in `srcs/front_react/src/game/gameReact/`
  
 // The creation of the game room for Fast game or Create/Join game in specific rooms in
 // `srcs/front_react/src/game/component/`
  
 // Queue system for the game,
  //the whole connection and messages emitted between the back and the front for collecting the data of the game in front and send it to the back for the other player.
  //everything is detailed for the back in this file `srcs/back_nestjs/src/game/game.gateway.ts`
  

  //The whole spectator system in `srcs/front_react/src/game/gameSpectator/`
  
  //## The game is not finished yet, there is still some bugs to fix and some features to add.

 // ## Paths
  
 // http://localhost:3000/  
 // joystick logo to see the game menu !
  
  //http://localhost:4000/game   display the database of all the rooms.
  //http://localhost:4000/game/del   delete the whole database.

  
  // useEffect reinint the game when the player leave the room or the game is over or the player give up

  function reinit_game(){
    player_left.name = "null";
    player_left.score = 0;
    player_left.won = false;

    player_right.name = "null";
    player_right.score = 0;
    player_right.won = false;

    ballObj.init_ball_pos = false;
    ballObj.first_col = false;
  }

  useEffect(() => {
    socket.on("leftRoom", (theroom: any) => {
      setnbrconnect(theroom.nbr_co);
      setopready(false);
      setimready(false);
      setgamestart(false);
      setop_id("");
      reinit_game();
    });

    socket.on("leftRoomEmpty", () => {
      setnbrconnect(0);
      setopready(false);
      setimready(false);
      setgamestart(false);
      setisinroom(false);
      setop_id("");
      reinit_game();
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
      setim_right(false);
      reinit_game();
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
