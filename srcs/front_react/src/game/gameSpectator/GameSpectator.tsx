import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import {
  socket,
} from "../Game";

import {
  BallMouv,
  BallCol_p2,
  BallCol_p1,
  PaddleMouv_p1,
  PaddleMouv_p2,
  draw_line,
  draw_score,
  draw_loading,
  draw_smasher,
} from "../gameReact/BallMouv";

import data from "../gameReact/data";
export let {
  ballObj,
  gameSpecs,
  player_p1,
  player_p2,
  paddleProps_p1,
  paddleProps_p2,
} = data;

let first_sinc = false;
let emit_to_get_room = true;

export function GameSpectator(props: any) {

  const [p1id, setp1id] = useState("null");
  const [p2id, setp2id] = useState("null");
  const [ThisRoom, setThisRoom] = useState("");
  const [power, setpower] = useState(0);

  // UsEffect who manage the canvas in spectator mode by getting the data from the socket.on send by the players who are playing

  let requestAnimationFrameId: any;
  useEffect(() => {
    socket.on("sincTheBall_spec", (theroom: any) => {
      console.log("sincTheBall_spec");
      if (theroom.power === 1 || theroom.power === 3
        || theroom.power === 5 || theroom.power === 7) {
        ballObj.ingame_dx = theroom.set.ball.power_ingame_dx;
        ballObj.ingame_dy = theroom.set.ball.power_ingame_dy;
  
        ballObj.first_dx = theroom.set.ball.power_first_dx;
        ballObj.first_dy = theroom.set.ball.power_first_dy;
      }
      else {
        ballObj.ingame_dx = theroom.set.ball.ingame_dx;
        ballObj.ingame_dy = theroom.set.ball.ingame_dy;
        
        ballObj.first_dx = theroom.set.ball.first_dx;
        ballObj.first_dy = theroom.set.ball.first_dy;
      }
      if (theroom.power === 2 || theroom.power === 3
      || theroom.power === 6 || theroom.power === 7) {
        ballObj.rad = theroom.set.ball.power_rad;
      }
      else {
        ballObj.rad = theroom.set.ball.rad;
      }
      ballObj.x = theroom.set.ball.x;
      ballObj.y = theroom.set.ball.y;

      ballObj.ball_way_x = theroom.set.ball.way_x;
      ballObj.ball_way_y = theroom.set.ball.way_y;
      
      ballObj.init_ball_pos = theroom.set.ball.init_ball_pos;
      ballObj.first_col = theroom.set.ball.first_col;
      gameSpecs.power = theroom.power;

      player_p1.score = theroom.set.set_p1.score;
      player_p2.score = theroom.set.set_p2.score;

      first_sinc = true;
      setpower(theroom.power);
    });
    socket.on("mouvPaddleLeft_spec", (theroom: any) => {
      paddleProps_p1.x = theroom.set.p1_paddle_obj.x;
      paddleProps_p1.y = theroom.set.p1_paddle_obj.y;
    });
    socket.on("mouvPaddleRight_spec", (theroom: any) => {
      paddleProps_p2.x = theroom.set.p2_paddle_obj.x;
      paddleProps_p2.y = theroom.set.p2_paddle_obj.y;
    });
    socket.on("setDataPlayerLeft_spec", (theroom: any) => {
      player_p1.score = theroom.set.set_p1.score;
      player_p1.won = theroom.set.set_p1.won;
      player_p1.name = theroom.set.set_p1.name;
      setp1id(theroom.set.set_p1.name);
    });
    socket.on("setDataPlayerRight_spec", (theroom: any) => {
      player_p2.score = theroom.set.set_p2.score;
      player_p2.won = theroom.set.set_p2.won;
      player_p2.name = theroom.set.set_p2.name;
      setp2id(theroom.set.set_p2.name);
    });
    socket.on("startGame_spec", (theroom: any) => {
      setp1id(theroom.set.set_p1.name);
      setp2id(theroom.set.set_p2.name);
      setThisRoom(theroom.room_name);
    });
    socket.on("player_give_upem_spec", (theroom: any) => {
      player_p2.won = theroom.set.set_p2.won;
      player_p1.won = theroom.set.set_p1.won;
    });
    if (props.Specthegame === true && emit_to_get_room === true) {
      socket.emit("Specthegame", props.Room_name_spec);
      emit_to_get_room = false;
    }

    // Canvas for the spectator game mode without any interaction

    const render = () => {
      requestAnimationFrameId = requestAnimationFrame(render);
      let canvas: any = props.canvasRef.current;
      let ctx = null;
      if (canvas)
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      if (ctx) {
        /* ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (player_p1.won === false && player_p2.won === false) {
          draw_line(ctx, ballObj, canvas.height, canvas.width);
          draw_score(ctx, player_p1, player_p2, canvas.height, canvas.width);
          if (first_sinc === true) {
            if (gameSpecs.power === 4 || gameSpecs.power === 5
            || gameSpecs.power === 6 || gameSpecs.power === 7)
              draw_smasher(ctx, gameSpecs, ballObj, canvas.height, canvas.width);
            BallMouv(ctx, gameSpecs, ballObj, canvas.height, canvas.width, power);
            BallCol_p1(ctx, gameSpecs, player_p2, ballObj, paddleProps_p1, canvas.height, canvas.width);
            BallCol_p2(ctx, gameSpecs, player_p1, ballObj, paddleProps_p2, canvas.height, canvas.width);
            PaddleMouv_p1(ctx, canvas, paddleProps_p1);
            PaddleMouv_p2(ctx, canvas, paddleProps_p2);
          }
          else
            draw_loading(ctx, canvas.height, canvas.width);
        } else {
          draw_score(ctx, player_p1, player_p2, canvas.height, canvas.width);
          cancelAnimationFrame(requestAnimationFrameId);
        } */
      }
    };
    render();
  }, [socket, props]);

  // reinit values for the next game spectator

  function leaveGameRoomSpec() {
    first_sinc = false;
    emit_to_get_room = true;
    props.setSpecthegame(false);
    props.setisLookingRoom(true);
    player_p1.name = "null";
    player_p1.score = 0;
    player_p1.won = false;

    player_p2.name = "null";
    player_p2.score = 0;
    player_p2.won = false;

    ballObj.init_ball_pos = false;
    ballObj.first_col = false;
    socket.emit("LeaveGameSpectator", ThisRoom);
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
      <h1>THE PONG SPECTATOR</h1>
      <Box
        sx={{
          display: "flex",
          p: 1,
          m: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <h2 style={{ color: "red", textAlign: "left" }}>{p1id}</h2>
        <h1 style={{ color: "black", textAlign: "center" }}> VS </h1>
        <h2 style={{ color: "red", textAlign: "right" }}>{p2id}</h2>
      </Box>

      <canvas
        id="canvas"
        ref={props.canvasRef}
        height="500px"
        width={1000}
        style={{ backgroundColor: "black" }}
      ></canvas>

      <br />
      <br />
      <Button variant="contained" onClick={leaveGameRoomSpec}>
        Leave the spectator Game
      </Button>
    </Grid>
  );
}