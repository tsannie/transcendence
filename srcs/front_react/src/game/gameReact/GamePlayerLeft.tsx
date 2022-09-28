import { paddleProps_left, player_left, player_right, socket } from "../Game";
import { Box, Button, createTheme, Grid, TextField } from "@mui/material";
import { MuiThemeProvider } from "@material-ui/core";
import useWindowDimensions from "./window_size";
import { useState } from "react";

export function GamePlayer_left(props: any) {
  const [windo, setwindo] = useState(false);

  const { height, width } = useWindowDimensions();

  function mouv_paddle_left(e: any) {
    if (props.opready === true && props.im_right === false) {
      //  console.log("111111111PADDLE DIDNT EMIT MOUV");
      paddleProps_left.y = e.clientY - paddleProps_left.width - 220;
      var data = {
        room: props.room,
        pd: paddleProps_left,
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
      <h1>THE PONG</h1>

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
      </Box>

      <canvas
        id="canvas"
        ref={props.canvasRef}
        height={500}
        width={1000}
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
    </Grid>
  );
}
