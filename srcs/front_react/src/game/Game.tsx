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

  const [isinroom, setisinroom] = useState(false);
  
  
  async function createGameRoom() {
    if (isinroom == false && room != "") {
      setisinroom(true);

      await socket.emit("createGameRoom", room);
      console.log(`--front--User join room [${room}]`);


    }
  };

  async function deleteGameRoom() {
    if (isinroom == true) {
      setisinroom(false);
      setRoom("");
  
      await socket.emit("leaveGameRoom", room);
      console.log(`--front--User leave room [${room}]`);
    }
  };

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
useEffect(
  () => {
  socket.on("joinedRoom", (data) => {
    setnbrconnect(data);
    console.log("recu le msg from back de : " + data + " == " + nbrconnect);
  });


/*   socket.on("leftRoom", (data) => {
    setnbrconnect(data);
    console.log("new leave from back " + data + " is os " + nbrconnect);
  }); */
    
/*     return () => {
      socket.off("leftRoom");
   };
     */
  }, [socket]);

  console.log("nbr co == " + nbrconnect);
  if (nbrconnect == 2 && isinroom) {
    return (
      <div className="readytoplay">
        <p> THE ROOM "{room}" IS READY TO PLAY </p>
        <button onClick={deleteGameRoom}>leave room {room}</button>
      </div>
    );
  }
  else if (isinroom == true) {
    return (
      <div className="queues">
        <p> waiting for opponent in room {room} </p>
        <button onClick={deleteGameRoom}>leave room {room}</button>
      </div>
    );
  }
  else {
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
