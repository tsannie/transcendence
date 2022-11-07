import React from "react";

const white = "#fff8dc";


export function draw_line(
  ctx: any,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();

  for (let x = canvas_height / 50; x <= canvas_height + (canvas_height/ 2); x += canvas_height / 12)
    ctx.rect((canvas_width / 2) - ((canvas_width/100)/2), x, canvas_width/100, canvas_height / 20);
  ctx.fillStyle = white;
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "grey";
  ctx.fill();
} 

export function draw_borders(
  ctx: any,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();
  ctx.rect(0, 0, canvas_width, canvas_height/50);
  ctx.rect(0, canvas_height - (canvas_height/50), canvas_width, canvas_height/50);
  ctx.fillStyle = white;
  ctx.fill();
}

export function draw_countdown(
  ctx: any,
  canvas_height: number,
  canvas_width: number,
  countdown: number,
) {



  ctx.beginPath();
  ctx.font = (canvas_width/4) + "px Arcade";
  ctx.fillStyle = white;
  ctx.textAlign = "center";
  ctx.fillText(countdown, canvas_height / 2, canvas_width / 2);
}

////////////////////////
//// DRAW
////////////////////////

export function draw_game_ended(im_p2: boolean, ctx: any, player_p1: any, player_p2: any, canvas_height: number, canvas_width: number)
{
  ctx.beginPath();
  ctx.rect(0, 0, canvas_width, canvas_height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.font = (canvas_width/10) + "px Arcade";
  ctx.fillStyle = white;
  ctx.textAlign = "center";
  ctx.fillText("Game Ended\n\n\n\n\n\n", canvas_width / 2, canvas_height / 2);
  if ((player_p1.gave_up === true && im_p2 === true) || (player_p2.gave_up === true && im_p2 === false))
    ctx.fillText("You Won, he GAVE UP", canvas_width / 2, (canvas_height / 2) + (canvas_height / 4));
  else if ((player_p1.won === true && im_p2 === false) || (player_p2.won === true && im_p2 === true))
    ctx.fillText("YOU Won !", canvas_width / 2, (canvas_height / 2) + (canvas_height / 4));
  else
    ctx.fillText("YOU Lost", canvas_width / 2, (canvas_height / 2) + (canvas_height / 4));

}


export function draw_score(
  ctx: any,
  player_p1: any,
  player_p2: any,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();

  ctx.font = (canvas_width/10) + "px Arcade";
  ctx.fillStyle = white;
  ctx.textAlign = "center";

  ctx.fillText(
    player_p1.score.toString(),
    canvas_width / 4,
    canvas_height / 4
  );
  ctx.fillText(
    player_p2.score.toString(),
    canvas_width - (canvas_width / 4),
    canvas_height / 4
  );
  ctx.fill();
}

////////////////////////
//// DRAW POWER
////////////////////////

export function draw_smasher(
  ctx: any,
  gameSpecs: any,
  ballObj: any,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();

  ctx.rect((canvas_width / 2) - 40, canvas_height - (canvas_height / 3), 80, 80);
  ctx.fillStyle = "red";
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "grey";
  ctx.fill();
  if (ballObj.x > (canvas_width / 2) - 40 && ballObj.x < (canvas_width / 2) + 40 && ballObj.y > canvas_height - (canvas_height / 3) && ballObj.y < canvas_height - (canvas_height / 3) + 80) {
    gameSpecs.smash = 3;
  }
}


////////////////////////
//// BALL FUNCTIONS
////////////////////////


////////////////////////
//// PADDLE FUNCTIONS
////////////////////////

export function draw_paddle(ctx: any , IPaddle : any, height : any, width : any){

  ctx.beginPath();
  ctx.rect(IPaddle.x, IPaddle.y, IPaddle.width, IPaddle.height);
  ctx.fillStyle = white;
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "blue";
  ctx.strokeRect(IPaddle.x, IPaddle.y, IPaddle.width, IPaddle.height);
  ctx.fill();
}

export function draw_ball(ctx: any , IBall : any, height : any, width : any){

  ctx.beginPath();
  ctx.fillStyle = white;
  ctx.rect(IBall.x - (2 * (IBall.rad / 2)), IBall.y - (2*(IBall.rad / 2)),
  IBall.rad * 2, IBall.rad * 2);

  //ctx.arc(IBall.x, IBall.y, IBall.rad, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.strokeWidth = 10;
  ctx.fill();
  ctx.stroke();
}