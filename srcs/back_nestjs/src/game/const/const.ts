export const screen_ratio: number = 16 / 9;
export const canvas_back_width: number = 1920;
export const canvas_back_height: number = canvas_back_width * screen_ratio;

export const victory_score: number = 2;

// BALL DATA

export const rad: number = 20;
export const gravity: number = 10; // TODO ask to ph change or not ?
export const speed: number = 6;
export const spawn_speed: number = 2;

// PADDLE DATA

export const paddle_margin: number = 100;
export const paddle_width: number = 50;
export const paddle_height: number = 600;
export const paddle_p1_x: number = paddle_margin;
export const paddle_p2_x: number =
  canvas_back_width - paddle_margin - paddle_width;

export enum GameMode {
  PONG_CLASSIC = 0,
  PONG_TRANS = 1,
}
