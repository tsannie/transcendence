import React, { createRef, useContext, useEffect, useState } from "react";
import {
  draw_game_ended,
  draw_game,
} from "./Draw";

import { canvas_back_height, canvas_back_width, paddle_height, paddle_margin, paddle_width, rad, screen_ratio} from "../const/const";
import { GameContext, RoomStatus } from "../GameContext";
import { SocketGameContext } from "../../../contexts/SocketGameContext";

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
  gave_up: boolean;
}

let position_y = 0;

export function GamePlayer_p1_p2() {
  
  let XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
  let ratio_width = (XlowerSize /canvas_back_width);
  let ratio_height = (XlowerSize / (screen_ratio)) / (canvas_back_height);
  let start = false;
  
  const game = useContext(GameContext);
  const socket = useContext(SocketGameContext);
  const canvasRef: any = createRef();
  
  let height = XlowerSize / screen_ratio
  let border_size = ((height) / 50);

  let IPlayer_p1 : IPlayer = { name: "", score: 0, won: false, gave_up: false };
  let IPlayer_p2 : IPlayer = { name: "", score: 0, won: false, gave_up: false };
  let IPaddle_p1 : IPaddle = {
    x: paddle_margin * ratio_width,
    y: height / 2,
    height: paddle_height * ratio_height,
    width: paddle_width * ratio_width
  };
  let IPaddle_p2 : IPaddle = {
    x: (canvas_back_width - paddle_margin - paddle_width) * ratio_width,
    y: height / 2,
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
      console.log("je change de taille");
      window.removeEventListener('resize', detectSize)
      //setLowerSize(window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
      XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
      ratio_width = (XlowerSize /canvas_back_width);
      
      let height = XlowerSize / screen_ratio
      border_size = ((height) / 50);
      socket.emit("resizeIngame", game.room);

    }
  }, [HW])
  
  
  function resizeGame(){
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
  }

  useEffect(() => {
    
     socket.on("resize_game", () => {
      resizeGame();

    });

    socket.on("giveUp", (set: any, status: number) => {
      IPlayer_p2.won = set.p2.won;
      IPlayer_p1.won = set.p1.won;
      if (IPlayer_p2.won)
        IPlayer_p1.gave_up = true;
      else if (IPlayer_p1.won)
        IPlayer_p2.gave_up = true;
    });

    socket.on("get_players", (p1: any, p2 : any) => {  
      IPlayer_p1 = p1;
      IPlayer_p2 = p2;
    });

    socket.on("getPaddleP1", (y: number) => {
      IPaddle_p1.y = y * ratio_height;
    });

    socket.on("getPaddleP2", (y: number) => {
      IPaddle_p2.y = y * ratio_height;
    });

    socket.on("get_ball", (x: any, y: any) => {
      IBall.x = x * ratio_width;
      IBall.y = y * ratio_height;
    });

    }, [socket]);

    function ask_paddle() {
      let data = {
        room: game.room,
        positionY: position_y,
        front_canvas_height: height,
      };
      if (game.isP2) {
        IPaddle_p2.y = position_y;
        socket.emit("askPaddleP2", data);
      }
      else {
        IPaddle_p1.y = position_y;
        socket.emit("askPaddleP1", data);
      }
    }
    
    let countdown = 3;
  
    useEffect(() => {
    let countdownInterval = setInterval(() => {
      countdown--;
      console.log("count");
      if (countdown === 0) {
        clearInterval(countdownInterval);
        start = true;
      }
    }, 1000);

    let canvas: any = canvasRef.current;
    const render = () => {
      requestAnimationFrame(render);
      let ctx : any = null;
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (game.isP2 === true && start === true) {
          console.log("Iplayer2", IPlayer_p2);
          console.log("Iplayer1", IPlayer_p1);
          socket.emit("gameRender", game.room);
          start = false;
        }
        if (IPlayer_p1.won === false && IPlayer_p2.won === false && game.room !== "") {
          ask_paddle()
          draw_game(ctx, canvas, IBall, IPaddle_p1, IPaddle_p2, IPlayer_p1, IPlayer_p2, countdown);
        }
        else
          draw_game_ended(game.isP2, ctx, IPlayer_p1, IPlayer_p2, canvas.height, canvas.width);
      }
    };
    render();
  }, []);

  function leaveGame() {
    if (countdown === 0) {
      game.setStatus(RoomStatus.CLOSED);
      if (IPlayer_p1.won === true || IPlayer_p2.won === true)
        socket.emit("endGame", game.room);
      else
        socket.emit("giveUp", game.room);
      game.setRoom("");
    }
  }
  ////////////////////////////////////////////////////

  function mouv_mouse(e: any) {
    const canvas = document.getElementById("canvas");
    var rect = canvas?.getBoundingClientRect() || {top: 0, left: 0};

    let tmp_pos = e.clientY - rect?.top - (IPaddle_p1.height / 2)

    if (tmp_pos > 0 && tmp_pos < (IPaddle_p1.height / 8))
      position_y = border_size;
    else if (tmp_pos > (height) - (IPaddle_p2.height))
      position_y = (height) - (border_size) - (IPaddle_p2.height);
    else if (tmp_pos > (height) - (IPaddle_p2.height) ||
    tmp_pos < 0)
      position_y = position_y;
    else
      position_y = tmp_pos;
  }

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        height={height}
        width={XlowerSize}
        onMouseMove={(e) => mouv_mouse(e)}
        style={{ backgroundColor: "black" }}
        ></canvas>
      <button
        onClick={leaveGame}>
        Leave The Game
      </button>
    </div>
  );
}
