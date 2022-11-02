

import { exit } from "process";
import { Socket } from "socket.io";
import { canvas_back_height, canvas_back_width, paddle_height, paddle_width, rad, spawn_gravity, spawn_speed, speed } from "./const/const";
import { BallEntity } from "./game_entity/ball.entity";
import { RoomEntity } from "./game_entity/room.entity";
import { PaddleEntity } from "./game_entity/paddle.entity";
import { PlayerEntity } from "./game_entity/players.entity";
import { SetEntity } from "./game_entity/set.entity";



export function mouv_ball(set: SetEntity) {

  if (set.ball.first_col === false) {
    set.ball.x += spawn_speed * set.ball.direction_x
    set.ball.y += spawn_gravity * set.ball.direction_y
  } else {
    set.ball.x += speed * set.ball.direction_x;
    set.ball.y += set.ball.gravity * set.ball.direction_y
  }

  // colision to wall up and down

/*   if (set.ball.x - rad <= 0)
  {
    console.log('col wall');
  set.ball.direction_x *= -1;
  }
  if (set.ball.x + rad >= canvas_back_width)
  {
    console.log("change direction x");
    set.ball.direction_x *= -1;
  } */
  if (set.ball.y + rad >= canvas_back_height)
    set.ball.direction_y *= -1;
  else if (set.ball.y - rad <= 0) 
    set.ball.direction_y *= -1;
}

function increment_score_player(player: PlayerEntity, ball: BallEntity) {
  ball.x = canvas_back_width / 2;
  ball.y = canvas_back_height / 2;

  ball.direction_y = 1;
  ball.first_col = false;
  
  player.score += 1;
  console.log('+= 1 p2');
}

function colision_paddle_player(paddle: PaddleEntity, ball: BallEntity) {
  let res = paddle.y + paddle_height - ball.y;
     ball.gravity = -(res / 10 - paddle_height / 20);
     
       // gameSpecs.smash = 1;
        //set.ball.direction_y = true;
      ball.direction_x *= -1; 
      ball.first_col = true;
       //set.ball.col_paddle = true;
       // set.ball.col_now_paddle = true;
       //console.log('col paddle');
}

export function BallCol_p1(set: SetEntity) {

  if ( set.ball.x - rad <= set.p1_paddle.x + paddle_width &&
  set.ball.x + (rad / 3) >= set.p1_paddle.x &&
  set.ball.y + rad >= set.p1_paddle.y &&
  set.ball.y - rad <= set.p1_paddle.y + paddle_height) {
    colision_paddle_player(set.p1_paddle, set.ball);
  }
  else if (set.ball.x - rad <= - (rad * 3))
    increment_score_player(set.p2, set.ball);
}
 
export function BallCol_p2(set: SetEntity) {

  if (set.ball.x + rad >= set.p2_paddle.x &&
  set.ball.x - (rad / 3) <= set.p2_paddle.x + paddle_width &&
  set.ball.y + rad >= set.p2_paddle.y &&
  set.ball.y - rad <= set.p2_paddle.y + paddle_height) {
    colision_paddle_player(set.p2_paddle, set.ball);
  }
  else if (set.ball.x + rad >= canvas_back_width + (rad * 3))
    increment_score_player(set.p1, set.ball);
}
