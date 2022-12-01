import { GameMode, RoomStatus, Winner } from "./const/const";

export interface IBall {
  x: number;
  y: number;
}

export interface IQuadrilateral {
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
  posY: number;
}

export interface ICreateRoom {
  mode: GameMode;
  invitation_user_id?: string;
}

export interface Room {
  // TODO clean useless
  id: string;
  private_room: boolean;

  status: RoomStatus;
  p1_id: string;
  p2_id: string;

  p1_score: number;
  p2_score: number;

  won: Winner;
  game_mode: GameMode;

  p1_y_paddle: number;
  p2_y_paddle: number;

  ball: IBall;

  smasher: IQuadrilateral;
  wall: IQuadrilateral;
}

export interface IDrawResponsive {
  canvas_width: number;
  canvas_height: number;
  ratio_width: number;
  ratio_height: number;
  border_size: number;
}

/*export interface IFrameResponsive {
  p1_paddle: IQuadrilateral;
  p2_paddle: IQuadrilateral;
  ball: IBall;
}*/
