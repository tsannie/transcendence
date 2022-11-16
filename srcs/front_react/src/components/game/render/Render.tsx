import React, { createRef, useContext, useEffect, useState } from "react";
import { draw_game_ended, draw_game } from "./Draw";
import {
  canvas_back_height,
  canvas_back_width,
  paddle_height,
  paddle_margin,
  paddle_width,
  rad,
  screen_ratio,
} from "../const/const";
import { GameContext, RoomStatus } from "../GameContext";
import { SocketGameContext } from "../../../contexts/SocketGameContext";
import { IaskPaddle, IGameObj, IPlayer } from "../types";
import { initObj } from "./InitGameObj";

let position_y: number = 0;
export function GamePlayer_p1_p2() {
  let lowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
  let ratio_width = lowerSize / canvas_back_width;
  let ratio_height = lowerSize / screen_ratio / canvas_back_height;
  let start = false;
  let height = lowerSize / screen_ratio;
  let border_size = height / 50;

  const game = useContext(GameContext);
  const socket = useContext(SocketGameContext);
  const canvasRef: any = createRef();
  let gameObj: IGameObj = initObj(ratio_width, ratio_height);

  const [HW, setdetectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const detectSize = () => {
    setdetectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };
  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
      lowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
      ratio_width = lowerSize / canvas_back_width;
      let height = lowerSize / screen_ratio;
      border_size = height / 50;
      socket.emit("resizeIngame", game.room);
    };
  }, [HW]);

  function resizeGame() {
    lowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
    ratio_width = lowerSize / canvas_back_width;
    ratio_height = lowerSize / screen_ratio / canvas_back_height;

    gameObj.ball.x = (canvas_back_width / 2) * ratio_width;
    gameObj.ball.y = (canvas_back_height / 2) * ratio_height;
    gameObj.ball.rad = rad * ratio_width;

    gameObj.paddle_p1.x = paddle_margin * ratio_width;
    gameObj.paddle_p1.height = paddle_height * ratio_height;
    gameObj.paddle_p1.width = paddle_width * ratio_width;

    gameObj.paddle_p2.x = (canvas_back_width - paddle_margin - paddle_width) * ratio_width;
    gameObj.paddle_p2.height = paddle_height * ratio_height;
    gameObj.paddle_p2.width = paddle_width * ratio_width;
  }

  useEffect(() => {
    socket.on("resize_game", () => {
      resizeGame();
    });

    socket.on("giveUp", (p1: IPlayer, p2: IPlayer) => {
      gameObj.player_p2.won = p2.won;
      gameObj.player_p1.won = p1.won;
      if (gameObj.player_p2.won)
        gameObj.player_p1.gave_up = true;
      else if (gameObj.player_p1.won)
        gameObj.player_p2.gave_up = true;
    });

    socket.on("get_players", (p1: IPlayer, p2: IPlayer) => {
      gameObj.player_p1 = p1;
      gameObj.player_p2 = p2;
    });

    socket.on("getPaddleP1", (y: number) => {
      gameObj.paddle_p1.y = y * ratio_height;
    });

    socket.on("getPaddleP2", (y: number) => {
      gameObj.paddle_p2.y = y * ratio_height;
    });

    socket.on("get_ball", (x: number, y: number) => {
      gameObj.ball.x = x * ratio_width;
      gameObj.ball.y = y * ratio_height;
    });
  }, [socket]);

  function ask_paddle() {
    let data: IaskPaddle = {
      room: game.room,
      positionY: position_y,
      front_canvas_height: height,
    };
    if (game.isP2) {
      gameObj.paddle_p2.y = position_y;
      socket.emit("askPaddleP2", data);
    } else {
      gameObj.paddle_p1.y = position_y;
      socket.emit("askPaddleP1", data);
    }
  }

  let countdown: number = 3;
  useEffect(() => {
    let countdownInterval = setInterval(() => {
      countdown--;
      if (countdown === 0) {
        clearInterval(countdownInterval);
        start = true;
      }
    }, 1000);

    let canvas: any = canvasRef.current;
    const render = () => {
      requestAnimationFrame(render);
      let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (game.isP2 === true && start === true) {
          socket.emit("gameRender", game.room);
          start = false;
        }
        if (gameObj.player_p1.won === false &&
        gameObj.player_p2.won === false &&
        game.room !== "") {
          ask_paddle();
          draw_game(ctx, canvas, gameObj, countdown);
        } else
          draw_game_ended(game.isP2, ctx, gameObj.player_p1, gameObj.player_p2, canvas.height, canvas.width);
      }
    };
    render();
  }, []);

  function leaveGame() {
    if (countdown === 0) {
      game.setStatus(RoomStatus.CLOSED);
      if (gameObj.player_p1.won === true || gameObj.player_p2.won === true)
        socket.emit("endGame", game.room);
      else
        socket.emit("giveUp", game.room);
      game.setRoom("");
    }
  }
  ////////////////////////////////////////////////////

  function mouv_mouse(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const canvas = document.getElementById("canvas");
    var rect = canvas?.getBoundingClientRect() || { top: 0, left: 0 };

    let tmp_pos = e.clientY - rect?.top - gameObj.paddle_p1.height / 2;

    if (tmp_pos > 0 && tmp_pos < gameObj.paddle_p1.height / 8)
      position_y = border_size;
    else if (tmp_pos > height - gameObj.paddle_p2.height)
      position_y = height - border_size - gameObj.paddle_p2.height;
    else if (tmp_pos > height - gameObj.paddle_p2.height || tmp_pos < 0)
      position_y = position_y;
    else position_y = tmp_pos;
  }

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        height={height}
        width={lowerSize}
        onMouseMove={(e) => mouv_mouse(e)}
        style={{ backgroundColor: "black" }}
      ></canvas>
      <button onClick={leaveGame}>Leave The Game</button>
    </div>
  );
}
