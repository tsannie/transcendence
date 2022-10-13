export default {
  gameSpecs: {
    smash: 1,
    power: 0,
    first_set: true,
  },
  
  ballObj: {
    x: 500,
    y: 250,
    
    ball_way_x : 0,
    ball_way_y : 0,
    
    init_ball_pos: false,
    first_col: false,

    rad: 10,
    is_col: false,
    
    ingame_dx: 0,
    ingame_dy: 0,
    
    first_dx: 0,
    first_dy: 0,

    col_paddle: false,
    col_now_paddle: false,
  },
  
  paddleProps_left: {
    height: 100,
    width: 20,
    color: "white",
    x: 100,
    y: 5,
  },
  paddleProps_right: {
    height: 100,
    width: 20,
    color: "white",
    x: 1000 - 20 - 100,
    y: 5,
  },

  player_left: {
    name: "data_null",
    score: 0,
    won: false,
  },
  player_right: {
    name: "data_null",
    score: 0,
    won: false,
  },
};

/* export interface IBall {
  x: number;
  y: number;
  ball_way_x: number;
  ball_way_y: number;
}

const ball: IBall;

ball.x = 10; */