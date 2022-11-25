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
  border_size_default,
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
import { IaskPaddle, IFrame, IGameObj, IPlayer, Room } from "../types";
import { initGameObj } from "./InitGameObj";

let position_y: number = 0;
export function GameRender() {
  // ???????????
  let lowerSize =
    window.innerWidth > window.innerHeight
      ? window.innerHeight
      : window.innerWidth;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [widthCanvas, setWidthCanvas] = useState<number>(lowerSize);
  const [heightCanvas, setHeightCanvas] = useState<number>(
    lowerSize / screen_ratio
  );
  const [border_size, setBorderSize] = useState<number>(
    lowerSize / screen_ratio / canvas_back_height / border_size_default
  );
  const [frameToDraw, setFrameToDraw] = useState<IFrame>();

  //const [gameObj] = useState<IGameObj>(initGameObj(ratio_width, ratio_height));
  const { room, setRoom, socket, isP2 } = useContext(
    GameContext
  ) as GameContextType;
  //let resize = new IResize();

  useEffect(() => {
    function draw() {
      lowerSize =
        window.innerWidth > window.innerHeight
          ? window.innerHeight
          : window.innerWidth;
      setWidthCanvas(lowerSize);
      setHeightCanvas(lowerSize / screen_ratio);

      const ratio_width = lowerSize / canvas_back_width;
      const ratio_height = lowerSize / screen_ratio / canvas_back_height;

      setBorderSize(
        lowerSize / screen_ratio / canvas_back_height / border_size_default
      );

      setFrameToDraw({
        p1_paddle: {
          x: paddle_margin * ratio_width,
          y: (canvas_back_height / 2 - paddle_height / 2) * ratio_height,
          width: paddle_width * ratio_width,
          height: paddle_height * ratio_height,
        },
        p2_paddle: {
          x: (canvas_back_width - paddle_margin - paddle_width) * ratio_width,
          y: (canvas_back_height / 2 - paddle_height / 2) * ratio_height,
          width: paddle_width * ratio_width,
          height: paddle_height * ratio_height,
        },
        ball: {
          x: (canvas_back_width / 2) * ratio_width,
          y: (canvas_back_height / 2) * ratio_height,
          rad: rad * ratio_width,
        },
      });

      //border_size = this.height / 50;

      /*gameObj.ball.x = (canvas_back_width / 2) * ratio_width;
      gameObj.ball.y = (canvas_back_height / 2) * ratio_height;
      gameObj.ball.rad = rad * ratio_width;

      gameObj.paddle_p1.x = paddle_margin * ratio_width;
      gameObj.paddle_p1.height = paddle_height * ratio_height;
      gameObj.paddle_p1.width = paddle_width * ratio_width;

      gameObj.paddle_p2.x =
        (canvas_back_width - paddle_margin - paddle_width) * ratio_width;
      gameObj.paddle_p2.height = paddle_height * ratio_height;
      gameObj.paddle_p2.width = paddle_width * ratio_width;*/
    }
    //console.log("useEffect");
    window.addEventListener("resize", draw);
    return () => {
      window.removeEventListener("resize", draw);
    };
  });
  //console.log("render", resize);

  /*useEffect(() => {
    socket?.on("resize_game", () => {
      resizeGame();
    });

    socket?.on("givgameObje_p2.y = room.p2_y_paddle * ratio_height;
      gameObj.paddle_p1.y = room.p1_y_paddle * ratio_height;
      gameObj.player_p1.score = room.p1_score;
      gameObj.player_p2.score = room.p2_score;
    });

    socket?.on("endGame", (room: Room) => {
      console.log("back say end game");
      console.log(room);
      setRoom(room);
    });
  }, [socket]);

  function setPaddle() {
    let data: IaskPaddle = {
      room: game.room,
      positionY: position_y,
      front_canvas_height: height,
    };
    socket?.emit("setPaddle", data);
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
          draw_game(ctx, canvas, room, 0, frameToDraw);
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

  useEffect(() => {
    // TODO refresh canvas if room is modified
  }, [room]);

  function leaveGame() {
    socket?.emit("giveUp", room?.id);
    setRoom(null);
  }*/

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
        height={heightCanvas}
        width={widthCanvas}
        onMouseMove={(e) => mouv_mouse(e)}
        style={{ backgroundColor: "black" }}
      ></canvas>
      <br />
      {/*<button onClick={leaveGame}>Leave The Game</button> */}
    </div>
  );
}
