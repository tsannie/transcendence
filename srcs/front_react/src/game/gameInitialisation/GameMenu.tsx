import { useEffect } from "react";
import { socket } from "../Game";

export default function GameMenu(props: any) {

  function StartGame(rom: string) {
    socket.emit("startGameRoom", rom);
  }
  
  useEffect(() => {
    
    socket.on("readyGame", (theroom: any) => {
      props.store.setColor_ready("green");
      if (
        (theroom.p2 === socket.id && theroom.p2_ready === true) ||
        (theroom.p1 === socket.id && theroom.p1_ready === true)
      )
        props.store.setimready(true);
      if (
        (theroom.p1 !==socket.id && theroom.p1_ready === true) ||
        (theroom.p2 !==socket.id && theroom.p2_ready === true)
      )
        props.store.setopready(true);
      if (theroom.p1_ready === true && theroom.p2_ready === true) {
        props.store.setRoom(theroom.room_name);
        StartGame(theroom.room_name);
        props.store.setgamestart(true);
      }



    });

    socket.on("joinedRoom", (theroom: any) => {
      props.store.setnbrconnect(theroom.nbr_co);
      props.store.setisinroom(true);
      props.store.setRoom(theroom.room_name);

      if (theroom.p2 === socket.id) {
        props.store.setop_id(theroom.p1);
        props.store.setim_right(true);
      } else if (theroom.p1 === socket.id) {
        props.store.setop_id(theroom.p2);
        props.store.setim_right(false);
      }
    });
    props.store.setisFull("");
    props.store.setmy_id(socket.id);
  }, [socket]);

  function lookAtAllGameRoom() {
    console.log("LOOK AT ALL GAME ROOM !!!!");
    props.store.setisLookingRoom(true);
    //socket.emit("lookAllGameRoom", "lookroom");
  }

  function createGameRoom() {
    if (props.store.room === "")
      props.store.setPP_empty("INVALID ROOM NAME");
    else if (props.store.isinroom === false) {
      socket.emit("createGameRoom", props.store.room);
    }
  }

  function createFastGameRoom() {
    props.store.setRoom("");
    if (props.store.isinroom === false) {
      socket.emit("createGameRoom", props.store.room);
    }
  }

  return (
    <div className="Game">
      <h2> you are : {props.store.my_id} </h2>

      <h4> Invite un ami a jouer</h4>
      <input
        type="text"
        placeholder="username"
        id="room"
        onChange={(event) => {
          props.store.setRoom(event.target.value);
        }}
      ></input>
      <button onClick={createGameRoom}>PARTIE PERSONALISE</button>
      <p>{props.store.PP_empty}</p>
      <br />
      <h4> partie classee</h4>

      <button onClick={createFastGameRoom}>PARTIE RAPIDE</button>

      <p style={{ color: "red" }}> {props.store.isfull} </p>

      <h4>
        REGARDER une partie :
        <button onClick={lookAtAllGameRoom}>regarder la partie</button>
      </h4>

  
    </div>
  );
}
