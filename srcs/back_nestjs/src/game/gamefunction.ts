import { Server } from 'socket.io';
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
  IBall,
} from './const/const';
import { PaddlePos } from './game.gateway';
import { PlayerEntity } from './entity/players.entity';
import { SetEntity } from './entity/set.entity';

export function mouv_ball(ball: IBall) {
  if (ball.x > canvas_back_width / 2 - 10 &&
    ball.x < canvas_back_width / 2 + 10 &&
    ball.can_touch_paddle == false) {
    ball.can_touch_paddle = true;
  }
  if (ball.first_col === false) {
    ball.x += spawn_speed * ball.direction_x;
    ball.y += gravity * ball.direction_y;
  } else {
    ball.x += speed * ball.direction_x;
    ball.y += ball.gravity * ball.direction_y;
  }

  if (ball.y + rad >= canvas_back_height - canvas_back_height / 40)
    ball.direction_y *= -1;
  else if (ball.y - rad <= canvas_back_height / 40)
    ball.direction_y *= -1;
}

function increment_score_player(
  player: PlayerEntity,
  ball: IBall,
  p1: PlayerEntity,
  p2: PlayerEntity,
  server: Server,
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

function colision_paddle_player(y: number, ball: IBall) {
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
  ball: IBall,
  paddle: PaddlePos,
  server: Server,
  room: string,
) {
  if (ball.can_touch_paddle === true &&
    ball.x - rad <= paddle_p1_x + paddle_width &&
    ball.x + rad / 3 >= paddle_p1_x &&
    ball.y + rad >= paddle.y1 &&
    ball.y - rad <= paddle.y1 + paddle_height) {
    colision_paddle_player(paddle.y1, ball);
  } else if (ball.x - rad <= -(rad * 3))
    increment_score_player(set.p2, ball, set.p1, set.p2, server, room);
}

export function BallCol_p2(
  set: SetEntity,
  ball: IBall,
  paddle: PaddlePos,
  server: Server,
  room: string,
) {
  if (ball.can_touch_paddle === true &&
    ball.x + rad >= paddle_p2_x &&
    ball.x - rad / 3 <= paddle_p2_x + paddle_width &&
    ball.y + rad >= paddle.y2 &&
    ball.y - rad <= paddle.y2 + paddle_height) {
    colision_paddle_player(paddle.y2, ball);
  } else if (ball.x + rad >= canvas_back_width + rad * 3)
    increment_score_player(set.p1, ball, set.p1, set.p2, server, room);
}
