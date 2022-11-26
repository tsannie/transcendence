import {
  canvas_back_height,
  canvas_back_width,
  smasher_size_ratio,
} from '../const/const';

export default class Smasher {
  constructor() {}

  height: number = canvas_back_width / smasher_size_ratio;
  width: number = canvas_back_width / smasher_size_ratio;
  x: number = canvas_back_width / 2 - this.width / 2;
  y: number = Math.floor(
    Math.random() * (canvas_back_height - canvas_back_height / 5),
  );
}
