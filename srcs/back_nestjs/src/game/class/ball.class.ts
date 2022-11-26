import { Server } from 'socket.io';
import {
  canvas_back_height,
  canvas_back_width,
  gravity,
  paddle_height,
  paddle_p1_x,
  paddle_p2_x,
  paddle_width,
  rad,
  speed_smasher,
  speed_spawn,
  speed,
} from '../const/const';
import Room, { GameMode, Winner } from './room.class';

export default class Ball {
  x: number = canvas_back_width / 2;
  y: number = canvas_back_height / 2;
  gravity: number = gravity;
  first_speed: boolean = true;
  col_paddle: boolean = false;
  can_hit_paddle: boolean = true;
  can_hit_wall: boolean = true;
  direction_x: number = 1;
  direction_y: number = 1;
  hit_smasher: boolean = false;

  update(room: Room) {
    this.mouvBall();
    this.hitPaddleP1(room);
    this.hitPaddleP2(room);

    if (room.game_mode === GameMode.PONG_TRANS) {
      this.hitWall(room);
      this.hitSmasher(room);
    }
  }

  reinitValueBool(direction_y: number) {
    this.direction_y = direction_y;
    this.hit_smasher = false;
    this.first_speed = false;
    this.can_hit_paddle = false;
    this.can_hit_wall = true;
  }

  mouvBall() {
    if (
      this.x > canvas_back_width / 2 - 10 &&
      this.x < canvas_back_width / 2 + 10 &&
      this.can_hit_paddle == false
    ) {
      this.can_hit_paddle = true;
    }
    if (this.first_speed === true) {
      this.x += speed_spawn * this.direction_x;
      this.y += gravity * this.direction_y;
    } else if (this.hit_smasher === true) {
      this.x += speed_smasher * this.direction_x;
      this.y += this.gravity * 2 * this.direction_y;
    } else {
      this.x += speed * this.direction_x;
      this.y += this.gravity * this.direction_y;
    }
    if (this.y + rad >= canvas_back_height) {
      this.direction_y *= -1;
      this.can_hit_wall = true;
    } else if (this.y - rad <= 0) {
      this.direction_y *= -1;
      this.can_hit_wall = true;
    }
  }

  hitPaddle(y_paddle: number) {
    const res = y_paddle + paddle_height - this.y;
    this.gravity = -(res / 10 - paddle_height / 20);
    Math.abs(this.gravity);

    this.direction_x *= -1;
    if (this.y < y_paddle - paddle_height / 2) this.direction_y = -1;
    else this.direction_y = 1;
    this.reinitValueBool(this.direction_y);
  }

  hitPaddleP1(room: Room) {
    if (
      room.game_mode === GameMode.PONG_CLASSIC &&
      this.can_hit_paddle === true &&
      this.x - rad <= paddle_p1_x + paddle_width &&
      this.x + rad / 3 >= paddle_p1_x &&
      this.y + rad >= room.p1_y_paddle &&
      this.y + rad <= room.p1_y_paddle + 10
    ) {
      this.reinitValueBool(-1);
    } else if (
      room.game_mode === GameMode.PONG_CLASSIC &&
      this.can_hit_paddle === true &&
      this.x - rad <= paddle_p1_x + paddle_width &&
      this.x + rad / 3 >= paddle_p1_x &&
      this.y - rad <= room.p1_y_paddle + paddle_height &&
      this.y - rad >= room.p1_y_paddle + paddle_height - 10
    ) {
      this.reinitValueBool(1);
    } else if (
      this.can_hit_paddle === true &&
      this.x - rad <= paddle_p1_x + paddle_width &&
      this.x + rad / 3 >= paddle_p1_x &&
      this.y + rad >= room.p1_y_paddle &&
      this.y - rad <= room.p1_y_paddle + paddle_height
    )
      this.hitPaddle(room.p1_y_paddle);
    else if (this.x - rad <= -(rad * 3)) {
      room.updateScore(Winner.P2);
    }
  }

  hitPaddleP2(room: Room) {
    if (
      room.game_mode === GameMode.PONG_CLASSIC &&
      this.can_hit_paddle === true &&
      this.x + rad >= paddle_p2_x &&
      this.x - rad / 3 <= paddle_p2_x + paddle_width &&
      this.y + rad >= room.p2_y_paddle &&
      this.y + rad <= room.p2_y_paddle + 10
    ) {
      this.reinitValueBool(-1);
    } else if (
      room.game_mode === GameMode.PONG_CLASSIC &&
      this.can_hit_paddle === true &&
      this.x + rad >= paddle_p2_x &&
      this.x - rad / 3 <= paddle_p2_x + paddle_width &&
      this.y - rad <= room.p2_y_paddle + paddle_height &&
      this.y - rad >= room.p2_y_paddle + paddle_height - 10
    ) {
      this.reinitValueBool(1);
    } else if (
      this.can_hit_paddle === true &&
      this.x + rad >= paddle_p2_x &&
      this.x - rad / 3 <= paddle_p2_x + paddle_width &&
      this.y + rad >= room.p2_y_paddle &&
      this.y - rad <= room.p2_y_paddle + paddle_height
    )
      this.hitPaddle(room.p2_y_paddle);
    else if (this.x + rad >= canvas_back_width + rad * 3) {
      room.updateScore(Winner.P1);
    }
  }

  hitWall(room: Room) {
    if (
      this.can_hit_wall === true &&
      this.y - rad < room.wall.y + room.wall.height &&
      this.y + rad >= room.wall.y &&
      this.x + rad >= room.wall.x &&
      this.x - rad < room.wall.x + room.wall.width
    ) {
      this.direction_y *= -1;
      this.can_hit_wall = false;
    }
  }

  hitSmasher(room: Room) {
    if (
      this.x >= room.smasher.x &&
      this.x <= room.smasher.x + room.smasher.width &&
      this.y >= room.smasher.y &&
      this.y <= room.smasher.y + room.smasher.height
    ) {
      this.hit_smasher = true;
    }
  }
}
