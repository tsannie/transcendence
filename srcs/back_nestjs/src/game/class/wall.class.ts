import {
  canvas_back_height,
  canvas_back_width,
  wall_height_ratio,
  wall_width_ratio,
} from '../const/const';

export default class Wall {
  constructor() {}

  height: number = canvas_back_width / wall_height_ratio;
  width: number = canvas_back_width / wall_width_ratio;
  x: number = canvas_back_width / 2 - this.width / 2;
  y: number = Math.floor(
    Math.random() * (canvas_back_height - canvas_back_height / 5),
  );
}
