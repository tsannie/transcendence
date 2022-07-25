import React, { useEffect, useState } from "react";
import "./Game.css";
import io from "socket.io-client";


const socket = io("http://localhost:4000/game");

socket.on("connect_error", (err) => {
  console.log(`|||||||||||connect_error due to ${err.message}`);
});

export default function Game() {
  const [nbrconnect, setnbrconnect] = useState(0);
  const [conect, setConect] = useState(0);
  const [room, setRoom] = useState("");
  const [color_ready, setColor_ready] = useState("");
  const [my_id, setmy_id] = useState(socket.id);
  const [op_id, setop_id] = useState("2");
  const [isfull, setisFull] = useState("");
  const [player_ready, setPlayerReady] = useState(0);
  const [isinroom, setisinroom] = useState(false);

  const [imready, setimready] = useState(false);
  const [opready, setopready] = useState(false);

/*   socket.on("connect", function () {
    console.log("CONNECT IO")
    const sessionID = socket.id; //
    setmy_id(socket.id);
  }); */

  function createGameRoom() {
    console.log("create game room front " + room + " " + isinroom + " " + nbrconnect);
    if (isinroom == false) {
      socket.emit("createGameRoom", room);
      console.log(`--front--User create room [${room}]`);
    }
  }

  function createFastGameRoom() {
    setRoom("");
    if (isinroom == false) {
      socket.emit("createGameRoom", room);
      console.log(`--front--User create FAST room [${room}]`);
    }
  }//

  function deleteGameRoom() {
    if (isinroom == true) {
      setisinroom(false);
      socket.emit("leaveGameRoom", room);
      console.log(`--front--User leave room [${room}]`);
      setRoom("");
    }
  }

  function startGame() {
    setColor_ready("green");
    socket.emit("readyGameRoom", room);
    console.log(`--player ready`);
  }

  /*   socket.on('co', () => {
    setmy_id(socket.id);

  }); */

  /*   const is_leaved_of_join = () => {
    socket.on("joinedRoom", function() {
      console.log(nbrconnect);
  
      setnbrconnect(1);
      console.log("new connection from back" + nbrconnect);
    });
  
  
    
  }; */

  useEffect(() => {
    socket.on("startGame", (theroom) => {
      setColor_ready("green");

      if (
        (theroom.player_two == socket.id && theroom.player_two_ready == true) ||
        (theroom.player_one == socket.id && theroom.player_one_ready == true)
      )
        setimready(true);
      if (
        (theroom.player_one != socket.id && theroom.player_one_ready == true) ||
        (theroom.player_two != socket.id && theroom.player_two_ready == true)
      )
        setopready(true);
      console.log("me : " + imready + " op : " + opready);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("joinedRoom", (theroom) => {
      setnbrconnect(theroom.nbr_co);
      setisinroom(true);
      setRoom(theroom.room_name)
      if (theroom.player_two == socket.id) setop_id(theroom.player_one);
      else if (theroom.player_one == socket.id) setop_id(theroom.player_two);
      console.log(
        "recu le msg from back de : " + theroom.nbr_co + " == " + nbrconnect
      );
    });
  }, [socket]);//

  useEffect(() => {
    socket.on("leftRoom", (theroom) => {
      setnbrconnect(theroom.nbr_co);
      setopready(false);
      setimready(false);

/*       if (theroom.nbr_co == 0)
        setRoom("");
      else
        setRoom(theroom.room_name); */
      setop_id("");

      //console.log("new leave from back " + theroom.nbr_co + " is os " + nbrconnect);
    });
  }, [socket]);

  useEffect(() => {
    setisFull("")

    socket.on("roomFull", (theroom) => {
      setisFull("This ROOM IS FULL MATE");
      console.log("THIS ROOM IS FULL");
    });
  }, [socket]);

  console.log("nbr co == " + nbrconnect);
  console.log("me : " + imready + " op : " + opready);
  console.log("op id == " + op_id);

  
  if (nbrconnect == 2 && isinroom && opready == true && imready == true) {
    return (
      <div className="startGame">
        <h1 style={{ color: "blue" }}> you are : {my_id} </h1>
        <h2 style={{ color: "red" }}> opponent is : {op_id} </h2>

        <button onClick={deleteGameRoom}>leave room {room}</button>
      </div>
    );
  } else if (nbrconnect == 2 && isinroom) {
    return (
      <div className="readytoplay">
        <h2> you are : {my_id} </h2>
        <p> THE ROOM "{room}" IS READY TO PLAY </p>
        <button onClick={deleteGameRoom}>leave room {room}</button>
        <button style={{ color: color_ready }} onClick={startGame}>
          {" "}
          READY ? {room}
        </button>

        <b>
          {opready ? (
            <h2 style={{ color: color_ready }}> opponent {op_id} is ready </h2>
          ) : (
            <h2> waiting for : {op_id} </h2>
          )}
        </b>
      </div>
    );
  } else if (isinroom == true) {
    return (
      <div className="queues">
        <h2> you are : {my_id} </h2>

        <p> waiting for opponent in room  {room} </p>
        <button onClick={deleteGameRoom}>leave room {room}</button>
      </div>
    );
  } else {
    return (
      <div className="Game">
        <h2> you are : {my_id} </h2>

        <h4> Cree une partie PERSONALISE</h4>
        <input
          type="text"
          placeholder="room"
          id="room"
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        ></input>
        <button onClick={createGameRoom}>PARTIE PERSONALISE</button>
        <br />
        <h4> Rentrer dans une partie RAPIDE</h4>

        <button onClick={createFastGameRoom}>PARTIE RAPIDE</button>


        <p style={{ color: "red" }}> {isfull} </p>
      </div>
    );
  }
}