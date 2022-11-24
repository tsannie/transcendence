import {
  canvas_back_height,
  canvas_back_width,
  GameMode,
  RoomStatus,
  screen_ratio,
  Winner,
} from "./const/const";

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
  rad: number;
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

export class IResize {
  update() {
    this.lowerSize =
      window.innerWidth > window.innerHeight
        ? window.innerHeight
        : window.innerWidth;

    this.ratio_width = this.lowerSize / canvas_back_width;
    this.ratio_height = this.lowerSize / screen_ratio / canvas_back_height;
    this.height = this.lowerSize / screen_ratio;
    this.border_size = this.height / 50;
  }

  lowerSize: number = 0;
  ratio_width: number = 0;
  ratio_height: number = 0;
  height: number = 0;
  border_size: number = 0;
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
