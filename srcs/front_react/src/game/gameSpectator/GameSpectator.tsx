import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { createRef, useEffect, useRef, useState } from "react";
import { threadId } from "worker_threads";
import {
  ballObj,
  paddleProps_left,
  paddleProps_right,
  player_left,
  player_right,
  socket,
} from "../Game";
import {
  BallMouv,
  BallCol_right,
  BallCol_left,
  PaddleMouv_left,
  PaddleMouv_right,
  draw_line,
  draw_score,
  draw_loading,
} from "../gameReact/BallMouv";
////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////

let first_sinc = false;

export function GameSpectator(props: any) {

  const [p1id, setp1id] = useState("null");
  const [p2id, setp2id] = useState("null");

  const [ThisRoom, setThisRoom] = useState("");

  //const [first_sinc, setfirst_sinc] = useState(false);

  // UseEffect recupere les info des joueurs en temps reel et les stock dans les objets du jeu
  // pour les afficher dans le canvas en mode spectateur

  function sinc_all_data(theroom: any) {
    ballObj.x = theroom.set.ball.x;
    ballObj.y = theroom.set.ball.y;
    ballObj.ingame_dx = theroom.set.ball.ingame_dx;
    ballObj.ingame_dy = theroom.set.ball.ingame_dy;
    ballObj.init_dx = theroom.set.ball.init_dx;
    ballObj.init_dy = theroom.set.ball.init_dy;
    ballObj.init_first_dx = theroom.set.ball.init_first_dx;
    ballObj.init_first_dy = theroom.set.ball.init_first_dy;
    ballObj.first_dx = theroom.set.ball.first_dx;
    ballObj.first_dy = theroom.set.ball.first_dy;
    ballObj.init_ball_pos = theroom.set.ball.init_ball_pos;
    ballObj.first_col = theroom.set.ball.first_col;

    player_left.score = theroom.set.set_p1.score;
    player_left.won = theroom.set.set_p1.won;
    player_left.name = theroom.set.set_p1.name;

    player_right.name = theroom.set.set_p2.name;
    player_right.score = theroom.set.set_p2.score;
    player_right.won = theroom.set.set_p2.won;
  }

  /*   UseEffect qui gere le canvas en mode spectateur afficher les info recupere dans 
  les socker.on precedents sans pouvoir modifier les variables et objets 
  du jeu des joueurs */
    

  let requestAnimationFrameId: any;
  useEffect(() => {
    socket.on("sincTheBall_spec", (theroom: any) => {
      ballObj.x = theroom.set.ball.x;
      ballObj.y = theroom.set.ball.y;

      ballObj.ingame_dx = theroom.set.ball.ingame_dx;
      ballObj.ingame_dy = theroom.set.ball.ingame_dy;

      ballObj.init_dx = theroom.set.ball.init_dx;
      ballObj.init_dy = theroom.set.ball.init_dy;

      ballObj.init_first_dx = theroom.set.ball.init_first_dx;
      ballObj.init_first_dy = theroom.set.ball.init_first_dy;

      ballObj.first_dx = theroom.set.ball.first_dx;
      ballObj.first_dy = theroom.set.ball.first_dy;

      ballObj.init_ball_pos = theroom.set.ball.init_ball_pos;
      ballObj.first_col = theroom.set.ball.first_col;
      console.log("first_sinc", first_sinc);

      first_sinc = true;
      console.log("first_sinc", first_sinc);
      console.log("sincTheBall_spec FROM SERVER REAL GAME"); 
    });
    socket.on("mouvPaddleLeft_spec", (theroom: any) => {
      paddleProps_left.x = theroom.set.p1_padle_obj.x;
      paddleProps_left.y = theroom.set.p1_padle_obj.y;
    });
    socket.on("mouvPaddleRight_spec", (theroom: any) => {
      paddleProps_right.x = theroom.set.p2_padle_obj.x;
      paddleProps_right.y = theroom.set.p2_padle_obj.y;
    });
    socket.on("setDataPlayerLeft_spec", (theroom: any) => {
      player_left.score = theroom.set.set_p1.score;
      player_left.won = theroom.set.set_p1.won;
    });
    socket.on("setDataPlayerRight_spec", (theroom: any) => {
      player_right.score = theroom.set.set_p2.score;
      player_right.won = theroom.set.set_p2.won;
    });

    socket.on("startGameSpec", (theroom: any) => {
      sinc_all_data(theroom);
      setp1id(theroom.set.set_p1.name);
      setp2id(theroom.set.set_p2.name);
      setThisRoom(theroom.room_name);

/*       props.store.setisLookingRoom(false);
      
      props.store.setSpecthegame(true); */

    });

    const render = () => {
      requestAnimationFrameId = requestAnimationFrame(render);
      
      let canvas: any = props.canvasRef.current;
      var ctx = null;
      if (canvas)
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (player_left.won === false && player_right.won === false) {
          draw_line(ctx, ballObj, canvas.height, canvas.width);
          draw_score(
            ctx,
            player_left,
            player_right,
            canvas.height,
            canvas.width
          );
          if (first_sinc === true) {
            BallMouv(ctx, ballObj, canvas.height, canvas.width);
            BallCol_left(
              ctx,
              player_right,
              ballObj,
              paddleProps_left,
              canvas.height,
              canvas.width
            );
            BallCol_right(
              ctx,
              player_left,
              ballObj,
              paddleProps_right,
              canvas.height,
              canvas.width
            );
            PaddleMouv_left(ctx, canvas, paddleProps_left);
            PaddleMouv_right(ctx, canvas, paddleProps_right);
          }
          else
            draw_loading(ctx, canvas.height, canvas.width);
        } else {
          console.log("score draw_end");
          draw_score(
            ctx,
            player_left,
            player_right,
            canvas.height,
            canvas.width
            );
            cancelAnimationFrame(requestAnimationFrameId);
          }
      }
    };
    render();
  }, [socket]);


  function deleteGameRoomSpec() {
    first_sinc = false;
    props.store.setSpecthegame(false);
    props.store.setisLookingRoom(true);
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
          display: 'flex',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
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
        <Button variant="contained"
          onClick={deleteGameRoomSpec} 
        >
          Leave the spectator Game
        </Button>
      </Grid>
  );
  }

////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////