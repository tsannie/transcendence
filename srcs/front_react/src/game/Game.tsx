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
  const [color_ready, setColor_ready] = useState("blue");
  const [my_id, setmy_id] = useState("1");
  const [op_id, setop_id] = useState("2");

  const [isinroom, setisinroom] = useState(false);

  function createGameRoom() {
    console.log(room + " " + isinroom + " " + nbrconnect);
   if (isinroom == false && room != "" ) {
     socket.emit("createGameRoom", room);
     console.log(`--front--User create room [${room}]`);
    }
  }
  
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
  }

  /*   const is_leaved_of_join = () => {
    socket.on("joinedRoom", function() {
      console.log(nbrconnect);
  
      setnbrconnect(1);
      console.log("new connection from back" + nbrconnect);
    });
  
  
    
  }; */

  /*   useEffect(
  
  return () => {
    socket.off("joinedRoom");
  };
  
}, [nbrconnect]);

*/
  useEffect(() => {
    socket.on("joinedRoom", (data, is_my_id, is_op_id) => {
      setnbrconnect(data);
      setisinroom(true);
      if (is_my_id != "")
        setmy_id(is_my_id);
      if (is_op_id != "")
        setop_id(is_op_id);
      console.log("recu le msg from back de : " + data + " == " + nbrconnect);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("leftRoom", (data) => {
      setnbrconnect(data);
      console.log("new leave from back " + data + " is os " + nbrconnect);
    });
  }, [socket]);
  /*     return () => {
      socket.off("leftRoom");
   };
     */

  console.log("nbr co == " + nbrconnect);
  if (nbrconnect == 2 && isinroom) {
    return (
      <div className="readytoplay">
        <p> THE ROOM "{room}" IS READY TO PLAY </p>
        <button onClick={deleteGameRoom}>leave room {room}</button>

        <button style={{color: color_ready}} onClick={startGame}> READY ? {room}</button>
        <h2>  you are : {my_id} </h2>

        <h2>  waiting for : {op_id} </h2>

      </div>
    );
  } else if (isinroom == true) {
    return (
      <div className="queues">
        <p> waiting for opponent in room {room} </p>
        <button onClick={deleteGameRoom}>leave room {room}</button>
        <h2>  you are : {my_id} </h2>
      </div>
    );
  } else {
    return (
      <div className="Game">
        <input
          type="text"
          placeholder="room"
          id="room"
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        ></input>
        <button onClick={createGameRoom}>CREATE</button>

        <p> nbr connect = {nbrconnect}</p>
        <p> conect {conect} </p>
      </div>
    );
  }
}
