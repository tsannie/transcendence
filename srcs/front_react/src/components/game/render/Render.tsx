import React, { createRef, useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { socket } from "../Game";
import {
  draw_line,
  draw_score,
  draw_paddle,
  draw_ball,
} from "./Draw";

import { canvas_back_height, canvas_back_width, paddle_height, paddle_margin, paddle_width, rad, screen_ratio, spawn_gravity, spawn_speed, speed} from "../const/const";
import { Button } from "@mui/material";
import { GameContext, RoomStatus } from "../GameContext";
import { api } from "../../../const/const";
import { Padding } from "@mui/icons-material";

interface IBall {
  x: number;
  y: number;
  rad : number;

  first_col : boolean;
    direction_x : number;
    direction_y : number;
    speed : number;
    gravity : number;
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
let x = 1;
export function GamePlayer_p1_p2() {

  let XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
  const ratio_width = (XlowerSize /canvas_back_width);
  const ratio_height = (XlowerSize / (screen_ratio)) / (canvas_back_height);

  const game = useContext(GameContext);

  const canvasRef: any = createRef();

  let IPlayer_p1 : IPlayer = { name: "", score: 0, won: false };
  let IPlayer_p2 : IPlayer = { name: "", score: 0, won: false };

  let IPaddle_p1 : IPaddle = {
    x: paddle_margin * ratio_width,
    y: 0,
    height: paddle_height * ratio_height,
    width: paddle_width * ratio_width
  };

  let IPaddle_p2 : IPaddle = { 
    x: (canvas_back_width - paddle_margin - paddle_width) * ratio_width,
    y: 0,
    height: paddle_height * ratio_height,
    width: paddle_width * ratio_width
  };

  let IBall : IBall = {
    x: (canvas_back_width / 2) * ratio_width,
    y: (canvas_back_height / 2) * ratio_height,
    rad: rad * ratio_width,
    first_col : false,
    direction_x : 1,
    direction_y : 1,
    speed : 0,
    gravity : spawn_gravity
  };

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

    socket.on("player_give_upem", (set: any, status: number) => {
      IPlayer_p2.won = set.p2.won;
      IPlayer_p1.won = set.p1.won;
      game.setStatus(game.status);

      console.log("status", status);
      console.log("game.status", game.status);
      //props.setgamestart(false);
      //console.log("xxxplayer_give_upem", IPlayer_p2.won, IPlayer_p1.won);
    });

/*     socket.on("get_the_paddle", (set: any) => {

      if (!set) {
        console.log("NO SET front");
        return;
      }


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
 */

    socket.on("get_players", (p1: any, p2 : any) => {  
      IPlayer_p1 = p1;
      IPlayer_p2 = p2;
    });

    socket.on("pad_p1", (y: number) => {
      IPaddle_p1.y = y * ratio_height;
    });


    socket.on("pad_p2", (y: number) => {
      IPaddle_p2.y = y * ratio_height;
    });


      socket.on("get_ball", (ball: any) => {

        //console.log("ball", ball.x, ball.y);
        console.log("get_ball on front");

            IBall.x = ball.x * ratio_width;
            IBall.y = ball.y * ratio_height;
            IBall.rad = ball.rad * ratio_width;
            IBall.first_col = ball.first_col;
            IBall.direction_x = ball.direction_x;
            IBall.direction_y = ball.direction_y;
            IBall.gravity = ball.gravity;

        });

    }, [socket]);


    // function that emit every second to the server the game data

    interface paddle_y {
      room: string;
      paddle_y: number;
      im_p2: boolean;
      front_canvas_height: number;
    }
/* 
    async function get_the_data(room_name: string) {
      console.log("getting the data FRONT= ", room_name);
      socket.emit("get_the_ball", room_name);

      let data : paddle_y = {
        room: game.room,
        paddle_y: position_y,
        im_p2: game.im_p2,
        front_canvas_height: lowerSize / screen_ratio,
      };

     // console.log("data", data);


      socket.emit("paddleMouv_time", data);
      //console.log("mouv_paddle_time", data.paddle_y)

    } */

    function get_paddle_p1() {

      let data = {
        room: game.room,
        paddle_y: position_y,
        front_canvas_height: lowerSize / screen_ratio,
      };
      IPaddle_p1.y = position_y;
      socket.emit("pad_p1", data);
    }

    function get_paddle_p2() {

      let data = {
        room: game.room,
        paddle_y: position_y,
        front_canvas_height: lowerSize / screen_ratio,
      };
      IPaddle_p2.y = position_y;
      socket.emit("pad_p2", data);
    }

    function get_ball(){

      let data = {
        room: game.room,
        ball_y: IBall.y,
        ball_x: IBall.x,
        front_canvas_height: lowerSize / screen_ratio,
        front_canvas_width: lowerSize,
      };
      socket.emit("get_ball", data);
    }

    function mouv_ball(){
      
      //console.log("IBall", IBall);

      if (IBall.first_col === false) {
        IBall.x += spawn_speed * IBall.direction_x; 
        IBall.y += spawn_gravity * IBall.direction_y;
      } else {
        IBall.x += speed * IBall.direction_x;
        IBall.y += IBall.gravity * IBall.direction_y;
      }


    }

useEffect(() => {
 
      let canvas: any = canvasRef.current;
      let ctx : any = null;
      if (canvas)
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

     function draw() {
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (IPlayer_p1.won === false && IPlayer_p2.won === false && game.room !== "") {
            
            //if (x === 1)  {
              //  x = 0;
              //}
              if (game.im_p2 === false) {
                get_paddle_p2()
              }
              else
              get_paddle_p1()
              
              //get_ball();
              
              get_ball();
              mouv_ball();
              
            draw_line(ctx, canvas.height, canvas.width);
            draw_score(ctx, IPlayer_p1, IPlayer_p2, canvas.height, canvas.width);
            draw_paddle(ctx, IPaddle_p1, canvas.height, canvas.width);
            draw_paddle(ctx, IPaddle_p2, canvas.height, canvas.width);
            draw_ball(ctx, IBall, canvas.height, canvas.width);
            }
          }
      }
      setInterval(draw, 100);
    }, []);


  function leaveGame() {
    game.setStatus(RoomStatus.CLOSED);
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

    //console.log("position_y", position_y);
    //console.log("height paddle p1", IPaddle_p1);
    //console.log("height paddle p2", IPaddle_p2);

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={lowerSize}
        height={lowerSize / screen_ratio}
        onMouseMove={(e) => position_y = e.clientY - (0.7 * (lowerSize / screen_ratio))}
        style={{ backgroundColor: "black" }}
        ></canvas>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "black",
          color: "white",
          mt: "2vh",
        }}
        onClick={leaveGame}
        >
        Leave The Game
      </Button>
    </div>
  );
}
