import { canvas_back_height, canvas_back_width, gravity } from '../const/const';

export default class Ball {
  x: number = canvas_back_width / 2;
  y: number = canvas_back_height / 2;
  gravity: number = gravity;
  first_col: boolean = false;
  col_paddle: boolean = false;
  can_touch_paddle: boolean = true;
  direction_x: number = 1;
  direction_y: number = 1;
}
