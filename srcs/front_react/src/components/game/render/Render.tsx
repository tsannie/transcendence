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
import { draw_game_classic, draw_game_ended } from "./Draw";
import {
  black,
  border_size_default,
  canvas_back_height,
  canvas_back_width,
  GameMode,
  paddle_height,
  RoomStatus,
  screen_ratio,
} from "../const/const";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { ISetPaddle, IPlayer, Room, IDrawResponsive } from "../types";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";
import { draw_game_trans } from "./DrawTrans";

let position_y: number = 0;
export function GameRender() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leave, setLeave] = useState(false);

  const [drawResponsive, setDrawResponsive] = useState<IDrawResponsive>();
  //const [frameToDraw, setFrameToDraw] = useState<Frame>();

  //const [gameObj] = useState<IGameObj>(initGameObj(ratio_width, ratio_height));
  const { room, setRoom, socket } = useContext(GameContext) as GameContextType;
  const { user } = useContext(AuthContext) as AuthContextType;
  //let resize = new IResize();

  function resize() {
    const lowerSize =
      window.innerWidth > window.innerHeight
        ? window.innerHeight
        : window.innerWidth;

    setDrawResponsive({
      canvas_width: lowerSize,
      canvas_height: lowerSize * screen_ratio,
      ratio_width: lowerSize / canvas_back_width,
      ratio_height: (lowerSize * screen_ratio) / canvas_back_height,
      border_size:
        border_size_default * (lowerSize / screen_ratio / canvas_back_height),
    });
  }

  useEffect(() => {
    // for the first mount
    resize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  useEffect(() => {
    if (leave) {
      setRoom(null);
    }
  }, [leave, room]);

  function leaveGame() {
    socket?.emit("leaveRoom", room?.id);
    setLeave(true);
    setRoom(null);
  }

  function setPaddle() {
    const data: ISetPaddle = {
      room_id: room?.id as string,
      positionY: position_y,
      front_canvas_height: drawResponsive?.canvas_height as number,
    };
    socket?.emit("setPaddle", data);
  }

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (room && canvas && drawResponsive) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (room.status === RoomStatus.PLAYING) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setPaddle();

            if (room.game_mode === GameMode.PONG_CLASSIC)
              draw_game_classic(ctx, canvas, room, drawResponsive, 0);
            else if (room.game_mode === GameMode.PONG_TRANS)
              draw_game_trans(ctx, canvas, room, drawResponsive, 0);
          } else {
            draw_game_ended(
              ctx,
              room,
              user?.id as string,
              canvas.height,
              canvas.width
            );
          }
        }
      }
    };

    if (drawResponsive && room) requestAnimationFrame(render);
  }, [room, drawResponsive]);

  function mouv_mouse(e: any) {
    if (!drawResponsive) return;

    const canvas = document.getElementById("canvas");
    const rect = canvas?.getBoundingClientRect() || { top: 0, left: 0 };

    const tmp_pos =
      e.clientY - rect?.top - (paddle_height * drawResponsive.ratio_height) / 2;

    if (tmp_pos <= drawResponsive.border_size) {
      position_y = drawResponsive.border_size + 1;
    } else if (
      tmp_pos + paddle_height * drawResponsive.ratio_height >=
      drawResponsive.canvas_height - drawResponsive.border_size
    ) {
      position_y =
        drawResponsive.canvas_height -
        1 -
        drawResponsive.border_size -
        paddle_height * drawResponsive.ratio_height;
    } else {
      position_y = tmp_pos;
    }
  }

  return (
    <Fragment>
      {drawResponsive ? (
        <Fragment>
          <canvas
            id="canvas"
            ref={canvasRef}
            height={drawResponsive.canvas_height}
            width={drawResponsive.canvas_width}
            onMouseMove={(e) => mouv_mouse(e)}
            style={{ backgroundColor: black }}></canvas>
          <br />
          <button onClick={leaveGame}>Leave The Game</button>
        </Fragment>
      ) : (
        <div>loading...</div>
      )}
    </Fragment>
  );
}
