import { Box, Button, Grid, radioClasses } from "@mui/material";
import { useEffect, useState } from "react";
import { screen_ratio } from "../const/const";
import { socket } from "../Game";
import { paddleProps_p1 } from "../Game";


export function GamePlayer_p1(props: any) {

  // Mouve the paddle left with the mouse and send the data to the server to send it to the other player
  function mouv_paddle_p1(e: any) {
    if (props.opready === true && props.im_p2 === false) {
      let pos_paddle_y: number;
      let pos_paddle_y_ratio: number;

      pos_paddle_y = e.clientY //* (lowerSize / screen_ratio);

      let data = {
        room: props.room,
        paddle_y : pos_paddle_y,
        lowerSize : props.plowerSize,
      };
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
        height={props.plowerSize / screen_ratio}
        width={props.plowerSize}
        onMouseMove={(e) => mouv_paddle_p1(e)}
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
