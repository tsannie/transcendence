import { Box, Button, Grid, radioClasses } from "@mui/material";
import { useEffect, useState } from "react";
import { screen_ratio } from "../const/const";
import { socket } from "../Game";
import { paddleProps_p1 } from "../Game";


export function GamePlayer_all(props: any) {

  // Mouve the paddle with the mouse and send the data to the server to send it to the other player
  function mouv_paddle(e: any) {
    if (props.opready === true) {
      let pos_paddle_y: number;
      pos_paddle_y = e.clientY

      let data = {
        room: props.room,
        paddle_y : pos_paddle_y,
        front_canvas_height: props.plowerSize / screen_ratio,
      };
      if (props.im_p2 === true) 
        socket.emit("paddleMouvRight", data)
      else
        socket.emit("paddleMouvLeft", data);
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
        width={props.plowerSize}
        height={props.plowerSize / screen_ratio}
        onMouseMove={(e) => mouv_paddle(e)}
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
              <h2 style={{ color: "blue", textAlign: "left" }}>{props.my_id}</h2>
              <h1 style={{ color: "black", textAlign: "center" }}> VS </h1>
              <h2 style={{ color: "red", textAlign: "right" }}>{props.op_id}</h2>
            </Box> */}
    </div>
  );
}