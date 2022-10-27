import React, { createRef, useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { socket } from "../Game";
import {
  draw_line,
  draw_score,
  draw_paddle,
  draw_ball,
} from "./BallMouv";


import { ContactSupport } from "@material-ui/icons";
import { canvas_back_height, canvas_back_width, screen_ratio } from "../const/const";
import { GamePlayer_all } from "./GamePlayer_all";
import { Button } from "@mui/material";
import { GameContext } from "../GameContext";

interface IBall {
  x: number;
  y: number;
  rad : number;
}

interface IPaddle {
  x: number;
  y: number;

  height: number;
  width: number;

}

interface IPlayer {
  name: string;
  score: number;
  won: boolean;
}

let position_y = 0;

export function GamePlayer_p1_p2() {

  const game = useContext(GameContext);

  const canvasRef: any = createRef();

  let IPlayer_p1 : IPlayer = { name: "", score: 0, won: false };
  let IPlayer_p2 : IPlayer = { name: "", score: 0, won: false };

  let IPaddle_p1 : IPaddle = { x: 0, y: 0, height: 0, width: 0 };
  let IPaddle_p2 : IPaddle = { x: 0, y: 0, height: 0, width: 0 };

  let IBall : IBall = { x: 0, y: 0, rad: 0};

  
  const [lowerSize, setLowerSize] = useState((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth));
  const [HW, setdetectHW] = useState({winWidth: window.innerWidth, winHeight: window.innerHeight,})
  const detectSize = () => {
    setdetectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    })
  }
  useEffect(() => {
    window.addEventListener('resize', detectSize)
    return () => {
      window.removeEventListener('resize', detectSize)
      setLowerSize(window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
      //console.log("+++setLowerSize", lowerSize);
      socket.emit("resize_ingame", game.room);
    }
  }, [HW])


  useEffect(() => {
    
    socket.on("player_give_upem", (set: any) => {
      IPlayer_p2.won = set.p2.won;
      IPlayer_p1.won = set.p1.won;

      //props.setgamestart(false);
      //console.log("xxxplayer_give_upem", IPlayer_p2.won, IPlayer_p1.won);
    });

    socket.on("get_the_paddle", (set: any) => {
      
      if (!set) {
        console.log("NO SET front");
        return;
      }
    let XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
      
     const ratio_width = (XlowerSize /canvas_back_width);
     const ratio_height = (XlowerSize / (screen_ratio)) / (canvas_back_height);
    
      //console.log("set.p1_paddle.y", set.p1_paddle.y);
     // console.log("set.p2_paddle.y", set.p2_paddle.y);

      // set paddle 
      set.p1_paddle.x *= ratio_width;
      set.p1_paddle.y *= ratio_height;
      set.p1_paddle.width *= ratio_width;
      set.p1_paddle.height *= ratio_height;

      set.p2_paddle.x *= ratio_width;
      set.p2_paddle.y *= ratio_height;
      set.p2_paddle.width *= ratio_width;
      set.p2_paddle.height *= ratio_height;

      if (game.im_p2 === true)
        IPaddle_p2.y = set.p2_paddle.y * ratio_height;
      else
        IPaddle_p1.y = set.p1_paddle.y;

      IPaddle_p1 = set.p1_paddle;
      IPaddle_p2 = set.p2_paddle;

      //console.log("IPaddle_p1", IPaddle_p1);
    });


    socket.on("get_the_ball", (ball: any) => {
      //console.log("GET DATA SEND THE GAME");
      //let XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
      //console.log("XlowerSize", XlowerSize);

      if (!ball) {
        console.log("NO SET front");
        return;
      }
     const ratio_width = (lowerSize /canvas_back_width);
     const ratio_height = (lowerSize / (screen_ratio)) / (canvas_back_height);
     
/*       IPlayer_p1 = set.p1;
      IPlayer_p2 = set.p2; */

      IBall.x = ball.x * ratio_width;
      IBall.y = ball.y * ratio_height;
      IBall.rad = ball.rad * ratio_width;
    });
  }, [socket]);


    // function that emit every second to the server the game data
    
    interface paddle_y {
      room: string;
      paddle_y: number;
      im_p2: boolean;
      front_canvas_height: number;
    }

    function get_the_data(room_name: string) {
      //console.log("getting the data FRONT= ", room_name);
      socket.emit("get_the_ball", room_name);
      
      let data : paddle_y = {
        room: game.room,
        paddle_y: position_y,
        im_p2: game.im_p2,
        front_canvas_height: lowerSize / screen_ratio,
      };
      
     // console.log("data", data);
      
    
      //socket.emit("paddleMouv_time", data);
      //console.log("mouv_paddle_time", data.paddle_y)
      
    }

  useEffect(() => {

      let canvas: any = canvasRef.current;
      let ctx : any = null;
      if (canvas)
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

     function draw () { 
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (IPlayer_p1.won === false && IPlayer_p2.won === false) {
          get_the_data(game.room);
          
          draw_line(ctx, canvas.height, canvas.width);
          draw_score(ctx, IPlayer_p1, IPlayer_p2, canvas.height, canvas.width);
          draw_paddle(ctx, IPaddle_p1, canvas.height, canvas.width);
          draw_paddle(ctx, IPaddle_p2, canvas.height, canvas.width);
          draw_ball(ctx, IBall, canvas.height, canvas.width);
          }
        }
      }
      // setInterval(draw, 1000 / 60); 60fps
      setInterval(draw, 1000 / 30);
    }, []);


  function leaveGame() {
    if (IPlayer_p1.won === true || IPlayer_p2.won === true)
    {
      console.log("end of game");
      socket.emit("end_of_the_game", game.room);
    }
    else
   {
    console.log("give up")
    socket.emit("player_give_up", game.room);
    }
    game.setRoom("");
  }
  ////////////////////////////////////////////////////

    console.log("position_y", position_y);

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={lowerSize}
        height={lowerSize / screen_ratio}
        onMouseMove={(e) => position_y = e.clientY}
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
        onClick={leaveGame}
        >
        Leave The Game
      </Button>
    </div>
  );
}
