

import { exit } from "process";
import { Socket } from "socket.io";
import { canvas_back_height, canvas_back_width, paddle_height, paddle_width, rad, spawn_gravity, spawn_speed, speed } from "./const/const";
import { GameEntity } from "./game_entity/game.entity";
import { SetEntity } from "./game_entity/set.entity";



export function mouv_ball(set: SetEntity) {

  if (set.ball.spawn === true) {
    //set.ball.x = canvas_width / 2;
    //set.ball.y = canvas_height / 2;
    //gameSpecs.smash = 1;
    //set.ball.ball_way_y = 1;
    //set.ball.col_paddle = false;
    //set.ball.init_ball_pos = true;

    set.ball.x = canvas_back_width / 2;
    set.ball.y = canvas_back_height / 2;


    set.ball.direction_y = 1;
    set.ball.spawn = false;
    set.ball.first_col = false;
  }

/*   if(set.ball.x > (canvas_back_width / 2) - 40 && set.ball.x < (canvas_back_width / 2) + 40)
    set.ball.col_paddle = false;
   */
  if (set.ball.first_col === false) {
    //console.log("set.ball.direction_x", set.ball.direction_x);
    set.ball.x += spawn_speed * set.ball.direction_x
    set.ball.y += spawn_gravity * set.ball.direction_y
  } else {
    //console.log("set.ball.direction_x", set.ball.direction_x);
    set.ball.x += speed * set.ball.direction_x;
    set.ball.y += set.ball.gravity * set.ball.direction_y
  }

  if (set.ball.y + rad > canvas_back_height)
    set.ball.direction_y *= -1;
  else if (set.ball.y - rad < 0) 
    set.ball.direction_y *= -1;
     
}

export function BallCol_p1(set: SetEntity) {

 // console.log("set.ball.x - rad", set.ball.x- rad);
  console.log(" < set.p1_paddle_obj.y", set.p1_paddle_obj.y);
  console.log(" < set.p2_paddle_obj.y", set.p2_paddle_obj.y);

  if ( set.ball.x - rad <= set.p1_paddle_obj.x + paddle_width &&
    set.ball.x + (rad / 3) >= set.p1_paddle_obj.x &&
    set.ball.y + rad >= set.p1_paddle_obj.y &&
    set.ball.y - rad <= set.p1_paddle_obj.y + paddle_height
    ) {
     let res = set.p1_paddle_obj.y + paddle_height - set.ball.y;
     set.ball.gravity = -(res / 10 - paddle_height / 20);
     
       // gameSpecs.smash = 1;
        //set.ball.direction_y = true;
        set.ball.direction_x *= -1; 
       set.ball.first_col = true;
       //set.ball.col_paddle = true;
       // set.ball.col_now_paddle = true;
       console.log('col p1');
      }
  else if (set.ball.x - rad <= - (rad * 3)) {
    //set.ball.init_ball_pos = false;
    //set.ball.first_col = false;
    set.ball.spawn = true
    set.set_p1.score += 1;
  }
}


      
export function BallCol_p2(set: SetEntity) {



  if (/* set.ball.col_paddle === false && */
    set.ball.x + rad >= set.p2_paddle_obj.x &&
    set.ball.x - (rad / 3) <= set.p2_paddle_obj.x + paddle_width &&
    set.ball.y + rad >= set.p2_paddle_obj.y &&
    set.ball.y - rad <= set.p2_paddle_obj.y + paddle_height
  ) {
    let res = set.p2_paddle_obj.y + paddle_height - set.ball.y;
    set.ball.gravity = -(res / 10 - paddle_height / 20);
    
    // gameSpecs.smash = 1;
    set.ball.direction_x *= -1;

    set.ball.first_col = true;
    //console.log("set.ball.direction_x", set.ball.direction_x);

  
    // set.ball.col_paddle = true;
    // set.ball.col_now_paddle = true;
    //console.log('col p2');
  }
  else if (set.ball.x + rad >= canvas_back_width + (rad * 3)) {
    //set.ball.init_ball_pos = false;
    //set.ball.first_col = false;

    set.ball.spawn = true
    set.set_p2.score += 1;
    console.log('lose');
  }
}
            
            

/* export function BallCol_p1(
  ctx: any,
  gameSpecs: any,
  player_p2: any,
  set.ball: any,
  set.p1_paddle_obj: any,
  canvas_height: number,
  canvas_width: number
) {
  if (player_p2.score >= 10) {
    player_p2.won = true;
  }
  else if (set.ball.x - rad <= - (rad * 3)) {
    set.ball.init_ball_pos = false;
    set.ball.first_col = false;
    player_p2.score += 1;
  }
  else if ( set.ball.col_paddle === false &&
    set.ball.x - rad <= set.p1_paddle_obj.x + paddle_width &&
    set.ball.x + (rad / 3) >= set.p1_paddle_obj.x &&
    set.ball.y + rad >= set.p1_paddle_obj.y &&
    set.ball.y - rad <= set.p1_paddle_obj.y + paddle_height
  ) {
    let res = set.p1_paddle_obj.y + paddle_height - set.ball.y;
    set.ball.ingame_dy = -(res / 10 - paddle_height / 20);
    
    gameSpecs.smash = 1;
    set.ball.ball.direction_y = 1;
    set.ball.ball.direction_x *= -1;

    set.ball.first_col = true;
    set.ball.col_paddle = true;
    set.ball.col_now_paddle = true;
  }

}

export function BallCol_p2(
  ctx: any,
  gameSpecs: any,
  player_p1: any,
  set.ball: any,
  set.p1_paddle_obj: any,
  canvas_height: number,
  canvas_width: number
) {
  if (player_p1.score >= 10) {
    player_p1.won = true;
  }
  else if (set.ball.x + rad >= canvas_width + (rad * 3)) {
    set.ball.init_ball_pos = false;
    set.ball.first_col = false;
    player_p1.score += 1;
  }
  else if ( set.ball.col_paddle === false &&
    set.ball.x + rad >= set.p1_paddle_obj.x &&
    set.ball.x - (rad / 3) <= set.p1_paddle_obj.x + paddle_width &&
    set.ball.y + rad >= set.p1_paddle_obj.y &&
    set.ball.y - rad <= set.p1_paddle_obj.y + paddle_height
  ) {
    let res = set.p1_paddle_obj.y + paddle_height - set.ball.y;
    set.ball.ingame_dy = -(res / 10 - paddle_height / 20);

    gameSpecs.smash = 1;
    set.ball.ball.direction_y = 1;
    set.ball.ball.direction_x *= -1;

    set.ball.first_col = true;
    set.ball.col_paddle = true;
    set.ball.col_now_paddle = true;
  }
}
 */


