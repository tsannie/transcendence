import { paddleProps_left, player_left, player_right, socket } from "../Game";
import {
  Box,
  Button,
  createTheme,
  Grid,
  TextField,
} from "@mui/material";
import { MuiThemeProvider } from "@material-ui/core";


export function GamePlayer_left(props: any) {
  function mouv_paddle_left(e: any) {
    if (
      props.gamestart === true &&
      props.im_right === false &&
      player_left.won === false &&
      player_right.won === false
    ) {
      paddleProps_left.y = e.clientY - paddleProps_left.width / 2 - 220;
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
          display: 'flex',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
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
          height="500px"
          width={1000}
          onMouseMove={(e) => mouv_paddle_left(e)}
          style={{ backgroundColor: "black" }}
        ></canvas>

        <br />
        <br />
        <Button variant="contained"
           sx={{
            backgroundColor: "black",
            color: "white",
          }}
          onClick={props.deleteGameRoom} 
        >
          Leave The Game
        </Button>
      </Grid>
  );
}