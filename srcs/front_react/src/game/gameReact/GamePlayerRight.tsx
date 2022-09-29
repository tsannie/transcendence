import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { socket } from "../Game";
import { paddleProps_right } from "../Game";

export function GamePlayer_right(props: any) {

  // Mouve the paddle right with the mouse and send the data to the server to send it to the other player

  function mouv_paddle_right(e: any) {
    if (props.opready === true && props.im_right === true) {
      paddleProps_right.y = e.clientY - paddleProps_right.width - 220;
      var data = {
        room: props.room,
        pd: paddleProps_right,
      };
      console.log("paddlemouvRight");
      socket.emit("paddleMouvRight", data);
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
        <h2 style={{ color: "red", textAlign: "right" }}>{props.op_id}</h2>
        <h1 style={{ color: "black", textAlign: "center" }}> VS </h1>
        <h2 style={{ color: "blue", textAlign: "right" }}>{props.my_id}</h2>
      </Box>

      <canvas
        id="canvas"
        ref={props.canvasRef}
        height={500}
        width={1000}
        onMouseMove={(e) => mouv_paddle_right(e)}
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
