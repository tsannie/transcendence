import {
  canvas_back_height,
  canvas_back_width,
  paddle_height,
  paddle_p1_x,
  paddle_p2_x,
  paddle_width,
  rad,
  gravity,
  spawn_speed,
  speed,
  victory_score,
} from './const/const';
import { BallEntity } from './game_entity/ball.entity';
import { PlayerEntity } from './game_entity/players.entity';
import { SetEntity } from './game_entity/set.entity';

export function mouv_ball(set: SetEntity) {
  if (set.ball.x > canvas_back_width / 2 - 10 &&
    set.ball.x < canvas_back_width / 2 + 10 &&
    set.ball.can_touch_paddle == false) {
    set.ball.can_touch_paddle = true;
  }
  if (set.ball.first_col === false) {
    set.ball.x += spawn_speed * set.ball.direction_x;
    set.ball.y += gravity * set.ball.direction_y;
  } else {
    set.ball.x += speed * set.ball.direction_x;
    set.ball.y += set.ball.gravity * set.ball.direction_y;
  }

  if (set.ball.y + rad >= canvas_back_height - canvas_back_height / 40)
    set.ball.direction_y *= -1;
  else if (set.ball.y - rad <= canvas_back_height / 40)
    set.ball.direction_y *= -1;
}

function increment_score_player(
  player: PlayerEntity,
  ball: BallEntity,
  p1: PlayerEntity,
  p2: PlayerEntity,
  server: any,
  room: string,
) {
  ball.x = canvas_back_width / 2;
  ball.y = canvas_back_height / 2;

  ball.direction_y = 1;
  ball.first_col = false;

  player.score += 1;
  if (player.score === victory_score)
    player.won = true;
  server.in(room).emit('get_players', p1, p2);
}

function colision_paddle_player(y: number, ball: BallEntity) {
  let res = y + paddle_height - ball.y;
  ball.gravity = -(res / 10 - paddle_height / 20);
  Math.abs(ball.gravity);

  ball.direction_x *= -1;

  if (ball.y < y - paddle_height / 2)
    ball.direction_y = -1;
  else
    ball.direction_y = 1;
  ball.first_col = true;
  ball.can_touch_paddle = false;
}

export function BallCol_p1(
  set: SetEntity,
  paddle: any,
  server: any,
  room: string,
) {
  if (set.ball.can_touch_paddle === true &&
    set.ball.x - rad <= paddle_p1_x + paddle_width &&
    set.ball.x + rad / 3 >= paddle_p1_x &&
    set.ball.y + rad >= paddle.y1 &&
    set.ball.y - rad <= paddle.y1 + paddle_height) {
    colision_paddle_player(paddle.y1, set.ball);
  } else if (set.ball.x - rad <= -(rad * 3))
    increment_score_player(set.p2, set.ball, set.p1, set.p2, server, room);
}

export function BallCol_p2(
  set: SetEntity,
  paddle: any,
  server: any,
  room: string,
) {
  if (set.ball.can_touch_paddle === true &&
    set.ball.x + rad >= paddle_p2_x &&
    set.ball.x - rad / 3 <= paddle_p2_x + paddle_width &&
    set.ball.y + rad >= paddle.y2 &&
    set.ball.y - rad <= paddle.y2 + paddle_height) {
    colision_paddle_player(paddle.y2, set.ball);
  } else if (set.ball.x + rad >= canvas_back_width + rad * 3)
    increment_score_player(set.p1, set.ball, set.p1, set.p2, server, room);
}
