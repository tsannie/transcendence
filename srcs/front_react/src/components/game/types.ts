import {
  canvas_back_height,
  canvas_back_width,
  GameMode,
  RoomStatus,
  screen_ratio,
  Winner,
} from "./const/const";

export interface IBall {
  x: number;
  y: number;
  //rad: number;
}

export interface IPaddle {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface IPlayer {
  user_id: string;
  score: number;
  won: boolean;
  gave_up: boolean;
}

export interface ISetPaddle {
  room_id: string;
  positionY: number;
  front_canvas_height: number;
}

export interface ICreateRoom {
  mode: GameMode;
}

export interface Room {
  // TODO clean useless
  id: string;

  status: RoomStatus;
  p1_id: string;
  p2_id: string;

  p1_SocketId: string;
  p2_SocketId: string;

  p1_score: number;
  p2_score: number;

  won: Winner;
  game_mode: string;

  p1_y_paddle: number;
  p2_y_paddle: number;

  ball: IBall;
}

export interface IDrawResponsive {
  canvas_width: number;
  canvas_height: number;
  ratio_width: number;
  ratio_height: number;
  border_size: number;
}

/*export interface IFrameResponsive {
  p1_paddle: IPaddle;
  p2_paddle: IPaddle;
  ball: IBall;
}*/
