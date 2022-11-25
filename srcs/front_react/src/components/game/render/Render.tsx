import React, {
  CanvasHTMLAttributes,
  createRef,
  Fragment,
  MouseEvent,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { draw_game } from "./Draw";
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
import { ISetPaddle, IPlayer, Room, IDrawResponsive } from "../types";

let position_y: number = 0;
export function GameRender() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [drawResponsive, setDrawResponsive] = useState<IDrawResponsive>();

  //const [frameToDraw, setFrameToDraw] = useState<Frame>();

  //const [gameObj] = useState<IGameObj>(initGameObj(ratio_width, ratio_height));
  const { room, setRoom, socket } = useContext(GameContext) as GameContextType;
  //let resize = new IResize();

  function resize() {
    const lowerSize =
      window.innerWidth > window.innerHeight
        ? window.innerHeight
        : window.innerWidth;

    setDrawResponsive({
      canvas_width: lowerSize,
      canvas_height: lowerSize / screen_ratio,
      ratio_width: lowerSize / canvas_back_width,
      ratio_height: lowerSize / screen_ratio / canvas_back_height,
      border_size:
        lowerSize / screen_ratio / canvas_back_height / border_size_default,
    });

    /*setFrameToDraw({
      p1_paddle: {
        x: paddle_margin * ratio_width,
        y: 0,
        width: paddle_width * ratio_width,
        height: paddle_height * ratio_height,
      },
      p2_paddle: {
        x: (canvas_back_width - paddle_margin - paddle_width) * ratio_width,
        y: 0,
        width: paddle_width * ratio_width,
        height: paddle_height * ratio_height,
      },
      ball: {
        x: (canvas_back_width / 2) * ratio_width,
        y: (canvas_back_height / 2) * ratio_height,
        rad: rad * ratio_width,
      },
    });*/
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
    });
  }, [socket]);

  function setPaddle() {
    const data: ISetPaddle = {
      room_id: room?.id as string,
      positionY: position_y,
      front_canvas_height: drawResponsive?.canvas_height as number,
    };
    socket?.emit("setPaddle", data);
  }

  useEffect(() => {
    // TODO refresh canvas if room is modified

    //console.log("NEW FRAME", room);

    const render = () => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      if (ctx && room && drawResponsive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (room.status === RoomStatus.PLAYING) {
          //console.log("status playing =", room.status);
          setPaddle();
          draw_game(ctx, canvas, room, drawResponsive, 0);
        } else console.log("status ended =", room.status);
        /*draw_game_ended(
            ctx,
            gameObj.player_p1,
            gameObj.player_p2,
            canvas.height,
            canvas.width
          );*/
      }
    };
    if (drawResponsive) render();
  }, [room, drawResponsive]);

  /*function leaveGame() {    // TODO DELETE
    socket?.emit("giveUp", room?.id);
    setRoom(null);
  }*/

  /*function mouv_mouse(e: MouseEvent<HTMLCanvasElement, MouseEvent>) {
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
  }*/

  return (
    <div>
      {drawResponsive ? (
        <Fragment>
          <canvas
            id="canvas"
            ref={canvasRef}
            height={drawResponsive.canvas_height}
            width={drawResponsive.canvas_width}
            //onMouseMove={(e) => mouv_mouse(e)}
            style={{ backgroundColor: "black" }}
          ></canvas>
          <br />
          {/*<button onClick={leaveGame}>Leave The Game</button> */}
        </Fragment>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}
