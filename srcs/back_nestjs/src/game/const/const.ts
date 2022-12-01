export const canvas_back_width: number = 1920;
export const canvas_back_height: number = (canvas_back_width * 9) / 16;

export const victory_score: number = 200;

// BALL DATA
export const rad: number = 20;
export const gravity: number = 5;
export const speed_spawn: number = 6;
export const speed: number = 14;
export const speed_smasher: number = 22;

// PADDLE DATA
export const paddle_margin: number = 100;
export const paddle_width: number = 40;
export const paddle_height: number = 200;
export const paddle_p1_x: number = paddle_margin;
export const paddle_p2_x: number =
  canvas_back_width - paddle_margin - paddle_width;

// WALL DATA
export const wall_height_ratio: number = 100;
export const wall_width_ratio: number = 3;

// SMASHER DATA
export const smasher_size_ratio: number = 10;
