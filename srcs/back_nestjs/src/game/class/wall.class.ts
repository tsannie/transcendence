import {
  canvas_back_height,
  canvas_back_width,
  wall_height_ratio,
  wall_width_ratio,
} from '../const/const';

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Wall {
  constructor() {}

  height: number = canvas_back_height / wall_height_ratio;
  width: number = canvas_back_width / wall_width_ratio;
  x: number = randomInteger(
    canvas_back_width / 3 - this.width / 2,
    canvas_back_width / 1.5 - this.width / 2,
  );
  y: number = randomInteger(canvas_back_height / 7, canvas_back_height / 1.2);
}
