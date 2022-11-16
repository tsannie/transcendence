import { canvas_back_height, canvas_back_width, paddle_height, paddle_margin, paddle_width, rad } from "../const/const";
import {IGameObj} from "../types";

export function iniObj(ratio_width: number, ratio_height: number) {

  let objs : IGameObj = {
    ball:{
      x: (canvas_back_width / 2) * ratio_width,
      y: (canvas_back_height / 2) * ratio_height,
      rad: rad * ratio_width,
    },
    paddle_p1: {
      x: paddle_margin * ratio_width,
      y: (canvas_back_height / 2) * ratio_height,
      height: paddle_height * ratio_height,
      width: paddle_width * ratio_width,
    },
    paddle_p2: {
      x: (canvas_back_width - paddle_margin - paddle_width) * ratio_width,
      y: (canvas_back_height / 2) * ratio_height,
      height: paddle_height * ratio_height,
      width: paddle_width * ratio_width,
    },
    player_p1: {
      name: "",
      score: 0,
      won: false,
      gave_up: false,
    },
    player_p2: {
      name: "",
      score: 0,
      won: false,
      gave_up: false,
    },
  };
  return objs;
}
