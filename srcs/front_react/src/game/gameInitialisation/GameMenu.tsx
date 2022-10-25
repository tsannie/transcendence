import { useEffect, useState } from "react";
import { socket } from "../Game";

export default function GameMenu(props: any) {
  const [PP_empty, setPP_empty] = useState("");

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
        props.setRoom(theroom.room_name);
        props.setgamestart(true);
        if (theroom.p1 === socket.id) {
          StartGame(theroom.room_name);
        }
      }
    });

    socket.on("joinedRoom", (theroom: any) => {
      props.setStatus(theroom.status);
      props.setisinroom(true);
      props.setRoom(theroom.room_name);
      if (theroom.p2 === socket.id) {
        props.setop_id(theroom.p1);
        props.setim_p2(true);
      } else if (theroom.p1 === socket.id) {
        props.setop_id(theroom.p2);
        props.setim_p2(false);
      }
    });
    props.setisFull("");
    props.setmy_id(socket.id);
  }, [socket]);

  function lookAtAllGameRoom() {
    props.setisLookingRoom(true);
  }

  // Room Game creation and join

  function createGameRoom() {
    if (props.room === "")
      setPP_empty("INVALID ROOM NAME");
    else if (props.isinroom === false) {
      socket.emit("createGameRoom", props.room);
    }
  }

  function createFastGameRoom() {
    props.setRoom("");
    if (props.isinroom === false)
      socket.emit("createGameRoom", props.room);
  }

  return (
    <div className="Game">
      <h2> you are : {props.my_id} </h2>

      <h4> Game by room</h4>
      <input
        type="text"
        placeholder="username"
        id="room"
        onChange={(event) => {
          props.setRoom(event.target.value);
        }}
      ></input>
      <button onClick={createGameRoom}>CREATE</button>
      <p>{PP_empty}</p>
      <br />
      <h4> Fast Game</h4>

      <button onClick={createFastGameRoom}>FAST GAME</button>

      <p style={{ color: "red" }}> {props.isfull} </p>

      <h4>
        Watch a game :
        <button onClick={lookAtAllGameRoom}>SPECTATOR</button>
      </h4>
    </div>
  );
}
