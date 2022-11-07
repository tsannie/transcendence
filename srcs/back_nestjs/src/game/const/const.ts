
export const screen_ratio: number = 16/9;
export const canvas_back_width: number = 1920;
export const canvas_back_height: number = canvas_back_width * screen_ratio;


// BALL DATA CONST

export const spawn_gravity: number = 10;
export const spawn_speed: number = 2;
export const speed: number = 6;

// POWER UP SPEED MOUV

/* export const speed: number = 3;
export const speed: number = 4;

export const power_ingame_dx_speed: number = 5;
export const power_ingame_dy_speed: number = 6; */

// BALL SIZE

export const power_rad : number = 30;
export const rad : number = 20;
export const victory_score: number = 20;

// PADDLE DATA
export const paddle_margin: number = 100;

export const paddle_width: number = 50;
export const paddle_height: number = 600;
export const paddle_p1_x : number = paddle_margin;
export const paddle_p2_x: number = canvas_back_width - paddle_margin - paddle_width;

