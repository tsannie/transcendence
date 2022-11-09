const white = "#fff8dc";


export function draw_game(ctx:any, canvas: any, IBall:any, IPaddle_p1: any, IPaddle_p2:any, IPlayer_p1:any, IPlayer_p2:any , countdown: any){
  if (countdown != 0) 
    draw_countdown(ctx, canvas.width, canvas.height, countdown);
  else {
    draw_line(ctx, canvas.height, canvas.width);
    draw_ball(ctx, IBall, canvas.height, canvas.width);
    draw_score(ctx, IPlayer_p1, IPlayer_p2, canvas.height, canvas.width);
  }
  draw_borders(ctx, canvas.height, canvas.width);
  draw_paddle(ctx, IPaddle_p1, canvas.height, canvas.width);
  draw_paddle(ctx, IPaddle_p2, canvas.height, canvas.width);
}

export function draw_game_ended(isP2: boolean, ctx: any, player_p1: any, player_p2: any, canvas_height: number, canvas_width: number)
{
  ctx.beginPath();
  ctx.rect(0, 0, canvas_width, canvas_height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.font = (canvas_width/10) + "px Arcade";
  ctx.fillStyle = white;
  ctx.textAlign = "center";
  ctx.fillText("Game Ended\n\n\n\n\n\n", canvas_width / 2, canvas_height / 2);
  if ((player_p1.gave_up === true && isP2 === true) || (player_p2.gave_up === true && isP2 === false))
    ctx.fillText("You Won, he GAVE UP", canvas_width / 2, (canvas_height / 2) + (canvas_height / 4));
  else if ((player_p1.won === true && isP2 === false) || (player_p2.won === true && isP2 === true))
    ctx.fillText("YOU Won !", canvas_width / 2, (canvas_height / 2) + (canvas_height / 4));
  else
    ctx.fillText("YOU Lost", canvas_width / 2, (canvas_height / 2) + (canvas_height / 4));
}

////////////////////////////////////////
////// DRAW LINES
////////////////////////////////////////

function draw_line(
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

function draw_borders(
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

function draw_countdown(
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
//// DRAW STATUS
////////////////////////

function draw_score(
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
//////// DRAW ELEMENTS
////////////////////////

function draw_paddle(ctx: any , IPaddle : any, height : any, width : any){

  ctx.beginPath();
  ctx.rect(IPaddle.x, IPaddle.y, IPaddle.width, IPaddle.height);
  ctx.fillStyle = white;
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "blue";
  ctx.strokeRect(IPaddle.x, IPaddle.y, IPaddle.width, IPaddle.height);
  ctx.fill();
}

function draw_ball(ctx: any , IBall : any, height : any, width : any){

  ctx.beginPath();
  ctx.fillStyle = white;
  ctx.rect(IBall.x - (2 * (IBall.rad / 2)), IBall.y - (2*(IBall.rad / 2)),
  IBall.rad * 2, IBall.rad * 2);
  ctx.strokeStyle = "black";
  ctx.strokeWidth = 10;
  ctx.fill();
  ctx.stroke();
}