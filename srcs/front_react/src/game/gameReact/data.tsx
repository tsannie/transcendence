export default {
  ballObj: {
    x: 500,
    y: 250,
    
    init_pos_x: 500,
    init_pos_y: 250,

    ball_way_x : 1,
    ball_way_y : 1,
  
    init_ball_pos: false,
    first_col: false,

    rad: 10,
    is_col: false,

    ingame_dx: 0,
    ingame_dy: 0,

    first_dx: 0,
    first_dy: 0,

    first_set: true,
    cal_right : false,
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
