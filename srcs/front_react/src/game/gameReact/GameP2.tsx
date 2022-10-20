import { Button, Grid, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { screen_ratio } from "../const/const";
import { socket } from "../Game";
import { paddleProps_p2 } from "../Game";


// set global variable for the canvas


export function GamePlayer_p2(props: any) {

  // Mouve the paddle right with the mouse and send the data to the server to send it to the other player

  function mouv_paddle_p2(e: any) {
    if (props.opready === true && props.im_p2 === true) {
      let pos_paddle_y: number;
      let pos_paddle_y_ratio: number;

      pos_paddle_y = e.clientY //* (lowerSize / screen_ratio);


      let data = {
        room: props.room,
        paddle_y : pos_paddle_y,
        lowerSize : props.plowerSize,
      };
      socket.emit("paddleMouvRight", data);
    }
  }

  return (
    <div
/*       container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "50vmin" }} */
    >


      <canvas
        id="canvas"
        ref={props.canvasRef}
        height={props.plowerSize / screen_ratio}
        width={props.plowerSize}
        onMouseMove={(e) => mouv_paddle_p2(e)}
        style={{ backgroundColor: "black" }}
        ></canvas>

      <br />
      <br />
      <Button
        variant="contained"
        sx={{
          backgroundColor: "black",
          color: "white",
        }}
        onClick={props.deleteGameRoom_ingame}
        >
        Leave The Game
      </Button>
{/*       <h1>THE PONG</h1>
        <Box
          sx={{
            display: "flex",
            p: 1,
            m: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
          >
          <h2 style={{ color: "red", textAlign: "right" }}>{props.op_id}</h2>
          <h1 style={{ color: "black", textAlign: "center" }}> VS </h1>
          <h2 style={{ color: "blue", textAlign: "right" }}>{props.my_id}</h2>
        </Box> */}
    </div>
  );
}
