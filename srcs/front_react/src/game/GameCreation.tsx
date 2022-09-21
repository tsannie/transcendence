import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ballObj, player_left, player_right, socket } from "./Game";


/* export function The_whole_creation() {


} */

export function GameCreation(props: any) {



  
  return (
    <div className="queues">
      <h2> you are : {props.my_id} </h2>

      <p> waiting for opponent in room {props.room} </p>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>
    </div>
  );
};