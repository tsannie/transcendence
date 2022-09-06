import { Box, Button, TextField } from "@mui/material";
import React, { useEffect } from "react";

export default function GameWaitReady(props: any) {
  return (
    <div className="readytoplay">
      <h2> you are : {props.my_id} </h2>
      <p> THE ROOM "{props.room}" IS READY TO PLAY </p>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>
      <button style={{ color: props.color_ready }} onClick={props.ReadyGame}>
        {" "}
        READY ? {props.room}
      </button>

      <b>
        {props.opready ? (
          <h2 style={{ color: props.color_ready }}> opponent {props.op_id} is ready </h2>
        ) : (
          <h2> waiting for : {props.op_id} </h2>
        )}
      </b>
    </div>
  );
};

export function GameCreation(props: any) {
  return (
    <div className="queues">
      <h2> you are : {props.my_id} </h2>

      <p> waiting for opponent in room {props.room} </p>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>
    </div>
  );
};