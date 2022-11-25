export const canvas_back_width: number = 1920;
export const screen_ratio: number = 16 / 9;
export const canvas_back_height: number = canvas_back_width * screen_ratio;

export const rad: number = 20;

export const border_size_default: number = 50;
export const paddle_margin: number = 100;
export const paddle_width: number = 50;
export const paddle_height: number = 600;

//export const victory_score: number = 5;

export const white = "#fff8dc";

export enum GameMode {
  PONG_1972 = "1972",
  PONG_TRANS = "TRANS",
}

export enum RoomStatus {
  EMPTY,
  WAITING,
  PLAYING,
}

export enum Winner {
  INMATCH = 0,
  P1 = 1,
  P2 = 2,
}
