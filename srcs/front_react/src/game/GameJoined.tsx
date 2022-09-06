import { Box, Button, TextField } from "@mui/material";
import React, { useEffect } from "react";

export default function GameJoined_left(props: any) {
  return (
    <div className="readyGame">
      <canvas
        id="canvas"
        ref={props.canvasRef}
        height="500px"
        width={1000}
        onMouseMove={(e) => props.mouv_paddle_right(e)}
        style={{ backgroundColor: "black" }}
      ></canvas>

      <h1 style={{ color: "blue" }}> you are : {props.my_id} </h1>
      <h2 style={{ color: "red" }}> opponent is : {props.op_id} </h2>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>
    </div>
  );
};

export function GameJoined_right(props: any) {
  return (
    <div className="readyGame">
      <canvas
        id="canvas"
        ref={props.canvasRef}
        height="500px"
        width={1000}
        onMouseMove={(e) => props.mouv_paddle_left(e, props)}
        style={{ backgroundColor: "black" }}
      ></canvas>

      <h1 style={{ color: "blue" }}> you are : {props.my_id} </h1>
      <h2 style={{ color: "red" }}> opponent is : {props.op_id} </h2>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>
    </div>
  );
}
 