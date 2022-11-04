import React, { createRef, useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { socket } from "../Game";
import {
  draw_line,
  draw_score,
  draw_paddle,
  draw_ball,
} from "./Draw";

import { canvas_back_height, canvas_back_width, paddle_height, paddle_margin, paddle_width, rad, screen_ratio} from "../const/const";
import { Button } from "@mui/material";
import { GameContext, RoomStatus } from "../GameContext";

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

  let XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
  let ratio_width = (XlowerSize /canvas_back_width);
  let ratio_height = (XlowerSize / (screen_ratio)) / (canvas_back_height);
  let start = true;
  let x = 0;

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
  };

  //const [lowerSize, setLowerSize] = useState((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth));
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
      //setLowerSize(window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
      XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
      ratio_width = (XlowerSize /canvas_back_width);
      //ratio_height = (XlowerSize / (screen_ratio)) / (canvas_back_height)
    
      socket.emit("resize_ingame", game.room);
    }
  }, [HW])


  useEffect(() => {

    socket.on("resize_game", () => {

      XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
      ratio_width = (XlowerSize /canvas_back_width);
      ratio_height = (XlowerSize / (screen_ratio)) / (canvas_back_height)

      IBall.x =(canvas_back_width / 2) * ratio_width;
      IBall.y = (canvas_back_height / 2) * ratio_height;
      IBall.rad = rad * ratio_width;

      IPaddle_p1.x = paddle_margin * ratio_width;
      IPaddle_p1.height = paddle_height * ratio_height;
      IPaddle_p1.width =  paddle_width * ratio_width;
  
      IPaddle_p2.x = (canvas_back_width - paddle_margin - paddle_width) * ratio_width;
      IPaddle_p2.height = paddle_height * ratio_height;
      IPaddle_p2.width = paddle_width * ratio_width;
    });


    socket.on("player_give_upem", (set: any, status: number) => {
      IPlayer_p2.won = set.p2.won;
      IPlayer_p1.won = set.p1.won;
      game.setStatus(game.status);
    });

    socket.on("get_players", (p1: any, p2 : any) => {  
      IPlayer_p1 = p1;
      IPlayer_p2 = p2;
    });

    socket.on("get_paddle_p1", (y: number) => {
      IPaddle_p1.y = y * ratio_height;
    });

    socket.on("get_paddle_p2", (y: number) => {
      IPaddle_p2.y = y * ratio_height;
    });

    socket.on("get_ball", (x: any, y: any) => {
      IBall.x = x * ratio_width;
      IBall.y = y * ratio_height;
    });

    }, [socket]);


/*     interface paddle_y {
      room: string;
      paddle_y: number;
      im_p2: boolean;
      front_canvas_height: number;
    }
 */

    function ask_paddle() {

      let data = {
        room: game.room,
        paddle_y: position_y,
        front_canvas_height: XlowerSize / screen_ratio,
      };
      if (game.im_p2) {
        IPaddle_p2.y = position_y;
        socket.emit("ask_paddle_p2", data);
      }
      else {
        IPaddle_p1.y = position_y;
        socket.emit("ask_paddle_p1", data);
      }
    }

    // set countdown timer


  useEffect(() => {
    let canvas: any = canvasRef.current;
    
      const render = () => {
        requestAnimationFrame(render);
        let ctx : any = null;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (IPlayer_p1.won === false && IPlayer_p2.won === false && game.room !== "") {
              if (game.im_p2 === true && start === true) {
                socket.emit("start_game_render", game.room);
                start = false;
              }
              ask_paddle()
              draw_line(ctx, canvas.height, canvas.width);
              draw_score(ctx, IPlayer_p1, IPlayer_p2, canvas.height, canvas.width);
              draw_paddle(ctx, IPaddle_p1, canvas.height, canvas.width);
              draw_paddle(ctx, IPaddle_p2, canvas.height, canvas.width);
              draw_ball(ctx, IBall, canvas.height, canvas.width);
              }
            }
      };
      render();
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

  function mouv_mouse(e: any) {
    const canvas = document.getElementById("canvas");
    var rect = canvas?.getBoundingClientRect() || {top: 0, left: 0};

    let tmp_pos = e.clientY - rect?.top - (IPaddle_p1.height / 2)

    if (tmp_pos > 0 && tmp_pos < (IPaddle_p1.height / 8))
      position_y = 0;
    else if (tmp_pos > (XlowerSize / screen_ratio) - (IPaddle_p2.height / 2))
      position_y = (XlowerSize / screen_ratio);
    else if (tmp_pos > (XlowerSize / screen_ratio) - (IPaddle_p2.height) ||
    tmp_pos < 0) {
        console.log("out of range");
    }
    else
      position_y = tmp_pos;
  }

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        height={XlowerSize / screen_ratio}
        width={XlowerSize}
        onMouseMove={(e) => mouv_mouse(e)}
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
