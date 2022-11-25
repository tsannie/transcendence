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
import { ISetPaddle, IPlayer, Room, Frame } from "../types";

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
  const [ratio_width, setRatioWidth] = useState<number>(
    lowerSize / canvas_back_width
  );
  const [ratio_height, setRatioHeight] = useState<number>(
    lowerSize / screen_ratio / canvas_back_height
  );

  const [frameToDraw, setFrameToDraw] = useState<Frame>();

  //const [gameObj] = useState<IGameObj>(initGameObj(ratio_width, ratio_height));
  const { room, setRoom, socket, isP2 } = useContext(
    GameContext
  ) as GameContextType;
  //let resize = new IResize();

  function resize() {
    lowerSize =
      window.innerWidth > window.innerHeight
        ? window.innerHeight
        : window.innerWidth;
    setWidthCanvas(lowerSize);
    setHeightCanvas(lowerSize / screen_ratio);

    const ratio_width_tmp = lowerSize / canvas_back_width;
    const ratio_height_tmp = lowerSize / screen_ratio / canvas_back_height;
    setRatioWidth(ratio_width_tmp);
    setRatioHeight(ratio_height_tmp);

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
  }

  useEffect(() => {
    resize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });
  //console.log("render", resize);

  useEffect(() => {
    /*socket?.on("giveUp", (p1: IPlayer, p2: IPlayer) => {  // TODO DELETE
      gameObj.player_p2.won = p2.won;
      gameObj.player_p1.won = p1.won;
      if (gameObj.player_p2.won)
        gameObj.player_p1.gave_up = true;
      else if (gameObj.player_p1.won)
        gameObj.player_p2.gave_up = true;
    });*/

    socket?.on("updateGame", (room: Room) => {
      setRoom(room);
      const frame = frameToDraw as Frame;
      console.log("frame:", frame);
      setFrameToDraw({
        ...frame,
        p1_paddle: {
          ...frame.p1_paddle,
          y: room.p1_y_paddle * ratio_height,
        },
        p2_paddle: {
          ...frame.p2_paddle,
          y: room.p2_y_paddle * ratio_height,
        },
        ball: {
          ...frame.ball,
          x: room.ball.x * ratio_width,
          y: room.ball.y * ratio_height,
        },
      });
    });
  }, [socket]);

  function setPaddle() {
    const data: ISetPaddle = {
      room_id: room?.id as string,
      positionY: position_y,
      front_canvas_height: heightCanvas,
    };
    socket?.emit("setPaddle", data);
  }

  useEffect(() => {
    // TODO refresh canvas if room is modified
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    //console.log("NEW FRAME", room);

    const render = () => {
      if (ctx && room) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (room.status === RoomStatus.PLAYING && frameToDraw) {
          //console.log("status playing =", room.status);
          setPaddle();
          draw_game(ctx, canvas, room, frameToDraw, 0);
        } else console.log("status ended =", room.status);
        /*draw_game_ended(
            isP2,
            ctx,
            gameObj.player_p1,
            gameObj.player_p2,
            canvas.height,
            canvas.width
          );*/
      }
    };
    render();
  }, [frameToDraw, room]);

  /*function leaveGame() {    // TODO DELETE
    socket?.emit("giveUp", room?.id);
    setRoom(null);
  }*/

  function mouv_mouse(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!frameToDraw) return;
    const canvas = document.getElementById("canvas");
    const rect = canvas?.getBoundingClientRect() || { top: 0, left: 0 };
    const tmp_pos = e.clientY - rect?.top - frameToDraw.p1_paddle.height / 2;

    if (tmp_pos > 0 && tmp_pos < frameToDraw.p1_paddle.height / 8)
      position_y = border_size;
    else if (tmp_pos > heightCanvas - frameToDraw.p2_paddle.height)
      position_y = heightCanvas - border_size - frameToDraw.p2_paddle.height;
    else if (
      tmp_pos > heightCanvas - frameToDraw.p2_paddle.height ||
      tmp_pos < 0
    )
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
