import { useState } from "react";
import { socket } from "../Game";

export function GameWaitPlayerReady(props: any) {
  const [color_ready, setColor_ready] = useState("");

  // Set both players ready before game start

  function ReadyGame() {
    setColor_ready("green");
    socket.emit("readyGameRoom", props.room);
  }

  return (
    <div className="readytoplay">
      <h2> you are : {props.my_id} </h2>
      <p> THE ROOM "{props.room}" IS READY TO PLAY </p>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>
      <button style={{ color: color_ready }} onClick={ReadyGame}>
        {" "}
        READY ? {props.room}
      </button>

      <b>
        {props.opready ? (
          <h2 style={{ color: "green" }}> opponent {props.op_id} is ready </h2>
        ) : (
          <h2> waiting for : {props.op_id} </h2>
        )}
      </b>
    </div>
  );
}
