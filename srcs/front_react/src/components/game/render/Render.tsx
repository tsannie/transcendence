import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  black,
  border_size_default,
  canvas_back_height,
  canvas_back_width,
  paddle_height,
} from "../const/const";
import { ReactComponent as LogOutIcon } from "../../../assets/img/icon/logout.svg";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { ISetPaddle, Room } from "../types";
import {
  AuthContext,
  AuthContextType,
  User,
} from "../../../contexts/AuthContext";
import { api } from "../../../const/const";
import { AxiosResponse } from "axios";
import Draw from "../class/draw.class";

let position_y: number = 0;
export function GameRender() {
  const [draw, setDraw] = useState<Draw | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, setPlayers] = useState<User[]>();
  const { room, socket, setDisplayRender, setRoom } = useContext(
    GameContext
  ) as GameContextType;
  const { user } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    const getPlayers = async () => {
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

      setPlayers([player1, player2]);
    };

    getPlayers();
  }, []);

  function leaveGame() {
    if (socket && room) {
      socket.emit("leaveRoom", room?.id);
      setRoom(null);
    }
    setDisplayRender(false);
  }

  function setPaddle(room: Room) {
    //if ()
    const newPosY =
      (position_y * canvas_back_height) /
      (canvasRef.current?.clientHeight as number);

    if (
      (user?.id === room.p1_id && room.p1_y_paddle !== newPosY) ||
      (user?.id === room.p2_id && room.p2_y_paddle !== newPosY)
    ) {
      if (socket && room) {
        const data: ISetPaddle = {
          room_id: room.id,
          posY: newPosY,
        };
        socket.emit("setPaddle", data);
      }
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (room && user && ctx) {
        setDraw(new Draw(room.game_mode, user.id, ctx));
      }
    }
  }, []);

  useEffect(() => {
    const render = () => {
      if (draw && room) {
        if (user?.id === room.p1_id || user?.id === room.p2_id) {
          setPaddle(room);
        }
        draw.render(room, canvasRef);
      }
    };
    requestAnimationFrame(render);
  }, [room, draw]);

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

  return (
    <div className="game">
      <div className="game__render">
        <div className="game__header">
          <button
            id="leave"
            onClick={leaveGame}
            disabled={room?.countdown !== 0}
          >
            <LogOutIcon />
          </button>
          {players ? (
            <Fragment>
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
            </Fragment>
          ) : (
            <span>loading...</span>
          )}
        </div>

        <div className="game__body">
          <canvas
            id="canvas"
            ref={canvasRef}
            height={canvas_back_height}
            width={canvas_back_width}
            onMouseMove={(e) => mouv_mouse(e)}
            style={{ backgroundColor: black }}
          ></canvas>
        </div>
      </div>
    </div>
  );
}
