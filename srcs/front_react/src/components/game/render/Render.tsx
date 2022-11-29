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
} from "../const/const";
import { ReactComponent as LogOutIcon } from "../../../assets/img/icon/logout.svg";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { ISetPaddle } from "../types";
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
  const [players, setPlayers] = useState<User[]>();
  const { room, socket, setDisplayRender, setRoom } = useContext(
    GameContext
  ) as GameContextType;
  const { user } = useContext(AuthContext) as AuthContextType;

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
  }, []);

  function leaveGame() {
    socket?.emit("leaveRoom", room?.id);
    setRoom(null);
    setDisplayRender(false);
  }

  function setPaddle() {
    const front_canvas_height: number = canvasRef.current
      ?.clientHeight as number;

    const data: ISetPaddle = {
      room_id: room?.id as string,
      posY: (position_y * canvas_back_height) / front_canvas_height,
    };
    socket?.emit("setPaddle", data);
  }

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (room && canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (room.status === RoomStatus.PLAYING) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (user?.id === room.p1_id || user?.id === room.p2_id) setPaddle();

            if (room.game_mode === GameMode.CLASSIC)
              draw_classic_game(ctx, canvas, room);
            else if (room.game_mode === GameMode.TRANS)
              draw_trans_game(ctx, canvas, room);
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

    if (room) requestAnimationFrame(render);
  }, [room]);

  function mouv_mouse(e: any) {
    const canvas = document.getElementById("canvas");
    const rect = canvas?.getBoundingClientRect() || { top: 0, left: 0 };

    const front_canvas_height: number = canvasRef.current
      ?.clientHeight as number;
    const paddle: number =
      paddle_height * (front_canvas_height / canvas_back_height);
    const border: number =
      border_size_default * (front_canvas_height / canvas_back_height);

    const tmp_pos = e.clientY - rect?.top - paddle / 2;
    if (tmp_pos <= border) {
      position_y = border;
    } else if (tmp_pos + paddle >= front_canvas_height - border) {
      position_y = front_canvas_height - border - paddle;
    } else {
      position_y = tmp_pos;
    }
  }

  if (!room || !players || !user) return <span>loading...</span>;
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
          <canvas
            id="canvas"
            ref={canvasRef}
            height={canvas_back_height}
            width={canvas_back_width}
            onMouseMove={(e) => mouv_mouse(e)}
            style={{ backgroundColor: black }}></canvas>
        </div>
      </div>
    </div>
  );
}
