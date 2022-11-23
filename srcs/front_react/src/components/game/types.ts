import { GameMode, RoomStatus, Winner } from "./const/const";

export interface IGameObj {
  ball: IBall; // edit delete ???
  paddle_p1: IPaddle;
  paddle_p2: IPaddle;
  player_p1: IPlayer;
  player_p2: IPlayer;
}

export interface IBall {
  x: number;
  y: number;
  rad: number; //  TODO where are you in back ??
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

export interface IaskPaddle {
  room_id?: string;
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
