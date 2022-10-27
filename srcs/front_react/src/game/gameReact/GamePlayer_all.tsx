import { Box, Button, Grid, radioClasses } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { screen_ratio } from "../const/const";
import { socket } from "../Game";
import { GameContext } from "../GameContext";


export function GamePlayer_all(props: any) {

  // Mouve the paddle with the mouse and send the data to the server to send it to the other player
  let position_y = 0;
  const game = useContext(GameContext);

  function mouv_paddle(e: any) {
    if (props.opready === true) {
      let pos_paddle_y: number = e.clientY
      position_y = pos_paddle_y;

      let data = {
        room: props.room,
        paddle_y: pos_paddle_y,
        im_p2: game.im_p2,
        front_canvas_height: props.plowerSize / screen_ratio,
      };
      socket.emit("paddleMouv", data);
    }
  }
/* 
  useEffect(() => {

    function mouv_paddle(e: any) {
      if (props.opready === true) {
  
        let data = {
          room: props.room,
          paddle_y: position_y,
          im_p2: game.im_p2,
          front_canvas_height: props.plowerSize / screen_ratio,
        };
        socket.emit("paddleMouv_time", data);
        console.log("mouv_paddle_time", data.paddle_y)
      }
    }
       setInterval(mouv_paddle, 1000/33)
    },[]);
 */
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