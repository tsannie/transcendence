import {
  canvas_back_height,
  canvas_back_width,
  gravity,
  rad,
  spawn_speed,
  speed,
} from '../const/const';

export default class Ball {
  x: number = canvas_back_width / 2;
  y: number = canvas_back_height / 2;
  gravity: number = gravity;
  first_col: boolean = false;
  col_paddle: boolean = false;
  can_touch_paddle: boolean = true;
  direction_x: number = 1;
  direction_y: number = 1;

  update() {
    if (
      this.x > canvas_back_width / 2 - 10 &&
      this.x < canvas_back_width / 2 + 10 &&
      this.can_touch_paddle == false
    ) {
      this.can_touch_paddle = true;
    }
    if (this.first_col === false) {
      this.x += spawn_speed * this.direction_x;
      this.y += gravity * this.direction_y;
    } else {
      this.x += speed * this.direction_x;
      this.y += this.gravity * this.direction_y;
    }
    if (this.y + rad >= canvas_back_height - canvas_back_height / 40)
      this.direction_y *= -1;
    else if (this.y - rad <= canvas_back_height / 40) this.direction_y *= -1;
  }
}
