import React, {
  CanvasHTMLAttributes,
  createRef,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { draw_game_ended, draw_game } from "./Draw";
import {
  canvas_back_height,
  canvas_back_width,
  paddle_height,
  paddle_margin,
  paddle_width,
  rad,
  RoomStatus,
  screen_ratio,
} from "../const/const";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IaskPaddle, IGameObj, IPlayer, Room } from "../types";
import { initGameObj } from "./InitGameObj";

let position_y: number = 0;
export function GameRender() {
  let lowerSize =
    window.innerWidth > window.innerHeight
      ? window.innerHeight
      : window.innerWidth;
  let ratio_width = lowerSize / canvas_back_width;
  let ratio_height = lowerSize / screen_ratio / canvas_back_height;
  let height = lowerSize / screen_ratio;
  let border_size = height / 50; // ???????????
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameObj] = useState<IGameObj>(initGameObj(ratio_width, ratio_height));
  const { room, setRoom, socket, isP2 } = useContext(
    GameContext
  ) as GameContextType;

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
      socket?.emit("resizeIngame", room?.id);
    };
  }, [HW]);

  function resizeGame() {
    lowerSize =
      window.innerWidth > window.innerHeight
        ? window.innerHeight
        : window.innerWidth;
    height = lowerSize / screen_ratio;
    border_size = height / 50;

    ratio_width = lowerSize / canvas_back_width;
    ratio_height = lowerSize / screen_ratio / canvas_back_height;

    gameObj.ball.x = (canvas_back_width / 2) * ratio_width;
    gameObj.ball.y = (canvas_back_height / 2) * ratio_height;
    gameObj.ball.rad = rad * ratio_width;

    gameObj.paddle_p1.x = paddle_margin * ratio_width;
    gameObj.paddle_p1.height = paddle_height * ratio_height;
    gameObj.paddle_p1.width = paddle_width * ratio_width;

    gameObj.paddle_p2.x =
      (canvas_back_width - paddle_margin - paddle_width) * ratio_width;
    gameObj.paddle_p2.height = paddle_height * ratio_height;
    gameObj.paddle_p2.width = paddle_width * ratio_width;
  }

  useEffect(() => {
    socket?.on("resize_game", () => {
      resizeGame();
    });

    socket?.on("giveUp", (p1: IPlayer, p2: IPlayer) => {
      gameObj.player_p2.won = p2.won;
      gameObj.player_p1.won = p1.won;
      if (gameObj.player_p2.won) gameObj.player_p1.gave_up = true;
      else if (gameObj.player_p1.won) gameObj.player_p2.gave_up = true;
    });

    socket?.on("getScore", (p1_score: number, p2_score: number) => {
      gameObj.player_p1.score = p1_score;
      gameObj.player_p2.score = p2_score;
    });

    socket?.on("getPaddleP1", (y: number) => {
      gameObj.paddle_p1.y = y * ratio_height;
    });

    socket?.on("getPaddleP2", (y: number) => {
      gameObj.paddle_p2.y = y * ratio_height;
    });

    socket?.on("getBall", (x: number, y: number) => {
      gameObj.ball.x = x * ratio_width;
      gameObj.ball.y = y * ratio_height;
    });

    socket?.on("endGame", (room: Room) => {
      console.log("back say end game");
      console.log(room);
      setRoom(room);
    });
  }, [socket]);

  function setPaddle() {
    let data: IaskPaddle = {
      room_id: room?.id,
      positionY: position_y,
      front_canvas_height: height,
    };
    if (isP2) {
      gameObj.paddle_p2.y = position_y;
      socket?.emit("setPaddleP2", data);
    } else {
      gameObj.paddle_p1.y = position_y;
      socket?.emit("setPaddleP1", data);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const render = () => {
      requestAnimationFrame(render);
      if (ctx && room) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (room.status === RoomStatus.PLAYING) {
          console.log("status playing =", room.status);
          setPaddle();
          draw_game(ctx, canvas, gameObj, 0);
        } else
          draw_game_ended(
            isP2,
            ctx,
            gameObj.player_p1,
            gameObj.player_p2,
            canvas.height,
            canvas.width
          );
      }
    };

    console.log("render");
    render();
  }, []);

  function leaveGame() {
    socket?.emit("giveUp", room?.id);
    setRoom(null);
  }

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
      <br />
      <button onClick={leaveGame}>Leave The Game</button>
    </div>
  );
}
