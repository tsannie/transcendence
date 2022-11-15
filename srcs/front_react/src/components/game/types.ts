import { GameMode } from "./const/const";

export interface IBall {
  x: number;
  y: number;
  rad : number;
}
export interface IPaddle {
  x: number;
  y: number;
  height: number;
  width: number;
}
export interface IPlayer {
  name: string;
  score: number;
  won: boolean;
  gave_up: boolean;
}

export interface IaskPaddle {
  room: string;
  positionY: number;
  front_canvas_height: number;
}

export interface ICreateRoom {
  room: string,
  mode: GameMode,
}