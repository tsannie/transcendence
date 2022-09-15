import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
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
} from "../gameReact/BallMouv";
////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////

let x = 0;

export function GameSpectator(props: any) {
  const [Specthegame, setSpecthegame] = useState(false);
  const [LookingRoom, setLookingRoom] = useState("null");

  const [p1id, setp1id] = useState("null");
  const [p2id, setp2id] = useState("null");

  // UseEffect recupere les info des joueurs en temps reel et les stock dans les objets du jeu
  // pour les afficher dans le canvas en mode spectateur

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
  }, [socket]);


  /*   UseEffect qui gere le canvas en mode spectateur afficher les info recupere dans 
    les socker.on precedents sans pouvoir modifier les variables et objets 
    du jeu des joueurs */

  useEffect(() => {
    socket.on("startGameSpec", (theroom: any) => {
      player_left.name = theroom.set.set_p1.name;
      player_right.name = theroom.set.set_p2.name;
      setp1id(theroom.set.set_p1.name);
      setp2id(theroom.set.set_p2.name);
      const render = () => {
        const canvas: any = props.canvasRef.current;
        var ctx = null;
        if (canvas)
          ctx = canvas.getContext("2d");
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
          } else {
            draw_score(
              ctx,
              player_left,
              player_right,
              canvas.height,
              canvas.width
            );
          }
          requestAnimationFrame(render);
        }
      };
      render();
    });
  }, [socket]);

    function Specthegamedisplayfunc(room : string) {
      //setLookingRoom(b);
      //console.log("Specthegame = " + Specthegame);
      //console.log("LookingRoom = " + LookingRoom);
      player_left.name = "ICI OK";
      player_right.name = "ICI OK RIGHT";
      socket.emit("Specthegame", room);
      setSpecthegame(true);
      player_left.name = "ICI PAS OK";
      player_right.name = "ICI pas OK RIGHT";
    }

  // Fonction qui gere le bouton pour quitter le mode spectateur

  const Specthegamedisplay = (event : any, param : any) => {
    console.log(param);
    Specthegamedisplayfunc(param);
  };

  function leavelookingroom() {
    //props.store.setisLookingRoom(false);
    //props.store.setLookingRoom("");
    socket.emit("LeaveAllGameRoom", "lookroom");

  }

  function deleteGameRoomSpec() {
    setSpecthegame(false);
    //props.store.setisLookingRoom(false);
    //props.store.setLookingRoom("");
   // socket.emit("LeaveAllGameRoom", "lookroom");
  }


  if (Specthegame === true) {
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
          Leave The Game
        </Button>
      </Grid>
  );
  }
  else {
    return (
      <div className="look">
        <h4> REGARDER une partie : </h4>
        <p> wich game do you want to look at ?</p>
        
        {props.listGame.map((element: any, index: any) => {
          return (
            <div key={index}>
              <p>
                partie : "{element}"{" "}
                <button onClick={event => Specthegamedisplay(event, element)}>
                regarder la partie
                </button>
              </p>
            </div>
          );
        })}
        <button onClick={leavelookingroom}>leave</button>
      </div>
    );
  }
}

////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////