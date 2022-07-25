import React, { useEffect, useState } from "react";
import "./Game.css";
import "./Game.tsx";

/* export default function InGame(socket : any, room : string) {
  const [my_room, setRoom] = useState("");
  const [my_id, setmy_id] = useState(socket.id);
  const [op_id, setop_id] = useState("2"); 

  function StartGame() {
      socket.emit("startGame", room);
    }

  useEffect(() => {
    socket.on("start_game", (theroom : any) => {
      setmy_id(socket.id);
      setRoom(theroom.room_name);
      if (theroom.player_one == my_id)
        setop_id(theroom.player_two);
      else
        setop_id(theroom.player_one);

    });
  }, [socket]);

  return (
    <div className="thegame">
      {StartGame()}
      <p>OUI C"EST ICI LE JEUX {my_id}</p>
      <p>{my_id} vs {op_id}</p>

    </div>
  );
}
 */