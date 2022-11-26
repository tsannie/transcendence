import {
  canvas_back_height,
  canvas_back_width,
  smasher_size_ratio,
} from '../const/const';

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Smasher {
  constructor() {}

  height: number = canvas_back_width / smasher_size_ratio;
  width: number = canvas_back_width / smasher_size_ratio;
  x: number = randomInteger(
    canvas_back_width / 3 - this.width / 2,
    canvas_back_width / 1.5 - this.width / 2,
  );
  y: number = canvas_back_height / 2 - this.height / 2;
}
