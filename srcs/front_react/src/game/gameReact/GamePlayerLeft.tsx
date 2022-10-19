import { Box, Button, Grid, radioClasses } from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "../Game";
import { paddleProps_left } from "../Game";

export function GamePlayer_left(props: any) {

  const [windowDimenion, detectHW] = useState({winWidth: window.innerWidth, winHeight: window.innerHeight,})
  const [lowerSize, setLowerSize] = useState((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth));
  const screen_ratio = 16/9;

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    })
  }

  useEffect(() => {
    window.addEventListener('resize', detectSize)
    return () => {
      window.removeEventListener('resize', detectSize)
      setLowerSize(window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
      let data = {
        room: props.room,
        canvas_height : lowerSize / screen_ratio,
        canvas_width : lowerSize,
      };
     // socket.emit("change_size_player_left", data);
    }
  }, [windowDimenion])
  

  // Mouve the paddle left with the mouse and send the data to the server to send it to the other player
  function mouv_paddle_left(e: any) {
    if (props.opready === true && props.im_right === false) {
      let x: number;
      x = e.clientY;

      let data = {
        room: props.room,
        paddle_y : x,
        lowerSize : lowerSize,
      };
      socket.emit("paddleMouvLeft", data);
    }
  }


  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "50vmin" }}
    >

      <canvas
        id="canvas"
        ref={props.canvasRef}
        height={lowerSize / screen_ratio}
        width={lowerSize}
        onMouseMove={(e) => mouv_paddle_left(e)}
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
    </Grid>
  );
}
