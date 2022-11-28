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
import { draw_classic_game, draw_game_ended } from "./Draw/DrawClassicGame";
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
import { ReactComponent as LogOutIcon } from "../../../assets/img/icon/logout.svg";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { ISetPaddle, IPlayer, Room, IDrawResponsive } from "../types";
import {
  AuthContext,
  AuthContextType,
  User,
} from "../../../contexts/AuthContext";
import { draw_trans_game } from "./Draw/DrawTransGame";
import { api } from "../../../const/const";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

let position_y: number = 0;
export function GameRender() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawResponsive, setDrawResponsive] = useState<IDrawResponsive>();
  const [players, setPlayers] = useState<User[]>();
  const { room, socket, setDisplayRender, setRoom } = useContext(
    GameContext
  ) as GameContextType;
  const { user } = useContext(AuthContext) as AuthContextType;

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
    const getPlayers = async () => {
      console.log("getPlayers");
      console.log("room", room);

      const player1 = await api
        .get("/user/id", { params: { id: room?.p1_id } })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err) => {
          leaveGame();
          console.log(err);
        });

      const player2 = await api
        .get("/user/id", { params: { id: room?.p2_id } })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch((err) => {
          leaveGame();
          console.log(err);
        });

      console.log("players:", player1, player2);
      setPlayers([player1, player2]);
    };

    getPlayers();
    resize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  function leaveGame() {
    socket?.emit("leaveRoom", room?.id);
    setRoom(null);
    setDisplayRender(false);
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

            if (user?.id === room.p1_id || user?.id === room.p2_id) setPaddle();

            if (room.game_mode === GameMode.PONG_CLASSIC)
              draw_classic_game(ctx, canvas, room, drawResponsive, 0);
            else if (room.game_mode === GameMode.PONG_TRANS)
              draw_trans_game(ctx, canvas, room, drawResponsive, 0);
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

    const tmp_pos = e.clientY - rect?.top;

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

  if (!drawResponsive || !room || !players || !user)
    return <span>loading...</span>;
  return (
    <div className="game">
      <div className="game__render">
        <div className="game__header">
          <button id="leave" onClick={leaveGame}>
            <LogOutIcon />
          </button>
          <div className="game__header__player" id="left">
            <img src={players[0].profile_picture} alt="player1" />
            <span>
              {players[0].username}({players[0].elo})
            </span>
          </div>

          <div className="game__header__player" id="right">
            <img src={players[1].profile_picture} alt="player2" />
            <span>
              {players[1].username}({players[1].elo})
            </span>
          </div>
        </div>

        <div className="game__body">
          {drawResponsive ? (
            <canvas
              id="canvas"
              ref={canvasRef}
              height={drawResponsive.canvas_height}
              width={drawResponsive.canvas_width}
              onMouseMove={(e) => mouv_mouse(e)}
              style={{ backgroundColor: black }}></canvas>
          ) : (
            <span>loading...</span>
          )}
        </div>
      </div>
    </div>
  );
}
