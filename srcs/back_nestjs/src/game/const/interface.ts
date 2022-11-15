export interface IBall {
  x: number;
  y: number;
  gravity: number;
  first_col: boolean;
  col_paddle: boolean;
  can_touch_paddle: boolean;
  direction_x: number;
  direction_y: number;
}

export interface PaddlePos {
  y1: number;
  y2: number;
}
