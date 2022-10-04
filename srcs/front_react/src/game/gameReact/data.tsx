export default {
  ballObj: {
    x: 500,
    y: 250,

    init_ball_pos: false,
    first_col: false,

    rad: 10,
    is_col: false,

    init_x: 500,
    init_y: 250,

    init_dx: 4,
    init_dy: 6,

    init_first_dx: 1,
    init_first_dy: 2,

    first_dx: 1,
    first_dy: 2,

    ingame_dx: 4,
    ingame_dy: 6,

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
