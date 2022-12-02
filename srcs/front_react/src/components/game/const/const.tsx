import { User } from "../../../contexts/AuthContext";

export const canvas_back_width: number = 1920;
export const canvas_back_height: number = (canvas_back_width * 9) / 16;

export const rad: number = 20;

export const border_size_default: number = 10;
export const paddle_margin: number = 100;
export const paddle_width: number = 40;
export const paddle_height: number = 200;

export const white = "#fff8dc";
export const black = "#1d1d1d";

export interface IException {
  status: string;
  message: string;
}

export enum GameMode {
  CLASSIC = 0,
  TRANS = 1,
}

export enum RoomStatus {
  WAITING = 0,
  PLAYING = 1,
  CLOSED = 2,
}

export enum Winner {
  INMATCH = 0,
  P1 = 1,
  P2 = 2,
}

export interface IInfoGame {
  search: number;
  ingame: number;
  online: number;
}

export interface IInvitation {
  user_id: string;
  room_id: string;
  mode: GameMode;
}

export interface IInfoRoom {
  id: string;
  status: RoomStatus;
  p1: User;
  p2: User;
  p1_score: number;
  p2_score: number;
}

export interface IGameStat {
  p1: User;
  p2: User;
  winner: Winner;
  eloDiff: number;
  p1_score: number;
  p2_score: number;
}
