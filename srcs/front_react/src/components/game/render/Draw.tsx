export function draw_line(
  ctx: any,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();

  for (let x = 10; x < canvas_height - 10; x += 40)
    ctx.rect(canvas_width / 2, x, 6, 30);
  ctx.fillStyle = "white";
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "grey";
  ctx.fill();
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
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Game Ended", canvas_width / 2, canvas_height / 2);
  if (player_p1.won === true && im_p2 === false)
    ctx.fillText("YOU Won !", canvas_width / 2, canvas_height / 2 + 50);
  else if (player_p2.won === true && im_p2 === true)
    ctx.fillText("YOU Won !!", canvas_width / 2, canvas_height / 2 + 50);
  else
    ctx.fillText("YOU Lost", canvas_width / 2, canvas_height / 2 + 50);
}

export function draw_loading(
  ctx: any,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Loading...", canvas_width / 2, canvas_height / 2);
}

export function draw_giveup(
  ctx: any,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Opponent GAVE UP", canvas_width / 2, canvas_height / 2);
}

export function draw_score(
  ctx: any,
  player_p1: any,
  player_p2: any,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();

  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.fillText(
    player_p1.score.toString() + "     " + player_p2.score.toString(),
    canvas_width / 2,
    canvas_height / 4
  );

  if (player_p1.won === 1)
    ctx.fillText(
      player_p1.name + " WON !!!",
      canvas_width / 2,
      canvas_height / 2
    );
  else if (player_p2.won === 1)
    ctx.fillText(
      player_p2.name + " WON !!!",
      canvas_width / 2,
      canvas_height / 2
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

  //console.log (IPaddle);

  ctx.beginPath();
  ctx.rect(IPaddle.x, IPaddle.y, IPaddle.width, IPaddle.height);
  ctx.fillStyle = "yellow";
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "blue";
  ctx.strokeRect(IPaddle.x, IPaddle.y, IPaddle.width, IPaddle.height);
  ctx.fill();
}

export function draw_ball(ctx: any , IBall : any, height : any, width : any){

  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(IBall.x, IBall.y, IBall.rad, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.strokeWidth = 10;
  ctx.fill();
  ctx.stroke();
}