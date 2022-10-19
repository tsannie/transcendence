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

export function draw_game_ended(im_right: boolean, ctx: any, player_left: any, player_right: any, canvas_height: number, canvas_width: number)
{
  ctx.beginPath();
  ctx.rect(0, 0, canvas_width, canvas_height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Game Ended", canvas_width / 2, canvas_height / 2);
  if (player_left.won === true && im_right === false)
    ctx.fillText("YOU Won !", canvas_width / 2, canvas_height / 2 + 50);
  else if (player_right.won === true && im_right === true)
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
  player_left: any,
  player_right: any,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();

  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.fillText(
    player_left.score.toString() + "     " + player_right.score.toString(),
    canvas_width / 2,
    canvas_height / 4
  );

  if (player_left.won === 1)
    ctx.fillText(
      player_left.name + " WON !!!",
      canvas_width / 2,
      canvas_height / 2
    );
  else if (player_right.won === 1)
    ctx.fillText(
      player_right.name + " WON !!!",
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

export function BallMouv(
  ctx: any,
  gameSpecs: any,
  ballObj: any,
  canvas_height: number,
  canvas_width: number,
  power: number,
) {
  let data = new Ball(ballObj.x, ballObj.y, ballObj.rad);

  
  ctx.fillStyle = "white";
  data.draw(ctx);

  if (gameSpecs.first_set === true) {
      console.log("REALY REALY FIRST SET");
      ballObj.ball_way_x = 1;
      ballObj.ball_way_y = 1;
      gameSpecs.smash = 1;
      gameSpecs.first_set = false;
  }
  if (ballObj.init_ball_pos === false) {
    ballObj.x = canvas_width / 2;
    ballObj.y = canvas_height / 2;
    gameSpecs.smash = 1;
    ballObj.ball_way_y = 1;
    ballObj.ingame_dy = 6;
    ballObj.col_paddle = false;
    ballObj.init_ball_pos = true;
  }

  if(ballObj.x > (canvas_width / 2) - 40 && ballObj.x < (canvas_width / 2) + 40)
    ballObj.col_paddle = false;

  if (ballObj.first_col === false) {
    ballObj.x += ballObj.first_dx * ballObj.ball_way_x;
    ballObj.y += ballObj.first_dy * ballObj.ball_way_y;
  } else {
    ballObj.x += ballObj.ingame_dx * gameSpecs.smash * ballObj.ball_way_x;
    ballObj.y += ballObj.ingame_dy * ballObj.ball_way_y;
  }

  if (ballObj.y + ballObj.rad > canvas_height)
    ballObj.ball_way_y *= -1;
  else if (ballObj.y - ballObj.rad < 0) 
    ballObj.ball_way_y *= -1;
}

export function BallCol_left(
  ctx: any,
  gameSpecs: any,
  player_right: any,
  ballObj: any,
  paddleProps: any,
  canvas_height: number,
  canvas_width: number
) {
  if (player_right.score >= 10) {
    player_right.won = true;
  }
  else if (ballObj.x - ballObj.rad <= - (ballObj.rad * 3)) {
    ballObj.init_ball_pos = false;
    ballObj.first_col = false;
    player_right.score += 1;
  }
  else if ( ballObj.col_paddle === false &&
    ballObj.x - ballObj.rad <= paddleProps.x + paddleProps.width &&
    ballObj.x + (ballObj.rad / 3) >= paddleProps.x &&
    ballObj.y + ballObj.rad >= paddleProps.y &&
    ballObj.y - ballObj.rad <= paddleProps.y + paddleProps.height
  ) {
    let res = paddleProps.y + paddleProps.height - ballObj.y;
    ballObj.ingame_dy = -(res / 10 - paddleProps.height / 20);
    
    gameSpecs.smash = 1;
    ballObj.ball_way_y = 1;
    ballObj.ball_way_x *= -1;

    ballObj.first_col = true;
    ballObj.col_paddle = true;
    ballObj.col_now_paddle = true;
  }

}

export function BallCol_right(
  ctx: any,
  gameSpecs: any,
  player_left: any,
  ballObj: any,
  paddleProps: any,
  canvas_height: number,
  canvas_width: number
) {
  if (player_left.score >= 10) {
    player_left.won = true;
  }
  else if (ballObj.x + ballObj.rad >= canvas_width + (ballObj.rad * 3)) {
    ballObj.init_ball_pos = false;
    ballObj.first_col = false;
    player_left.score += 1;
  }
  else if ( ballObj.col_paddle === false &&
    ballObj.x + ballObj.rad >= paddleProps.x &&
    ballObj.x - (ballObj.rad / 3) <= paddleProps.x + paddleProps.width &&
    ballObj.y + ballObj.rad >= paddleProps.y &&
    ballObj.y - ballObj.rad <= paddleProps.y + paddleProps.height
  ) {
    let res = paddleProps.y + paddleProps.height - ballObj.y;
    ballObj.ingame_dy = -(res / 10 - paddleProps.height / 20);

    gameSpecs.smash = 1;
    ballObj.ball_way_y = 1;
    ballObj.ball_way_x *= -1;

    ballObj.first_col = true;
    ballObj.col_paddle = true;
    ballObj.col_now_paddle = true;
  }
}

class Ball {
  x: number;
  y: number;
  rad: number;

  constructor(x: number, y: number, rad: number) {
    this.x = x;
    this.y = y;
    this.rad = rad;
  }
  draw(ctx: any) {
    ctx.beginPath();
    ctx.fillStryle = "blue";
    ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.strokeWidth = 10;
    ctx.fill();
    ctx.stroke();
  }
}

////////////////////////
//// PADDLE FUNCTIONS
////////////////////////

export function PaddleMouv_left(ctx: any, canvas: any, paddleProps: any) {
  class Paddle {
    x: number;
    y: number;
    height: number;
    width: number;
    colors: string[];

    constructor(y: number) {
      this.x = paddleProps.x;
      this.y = y;
      this.height = paddleProps.height;
      this.width = paddleProps.width;
      this.colors = ["white", "blue"];
    }
    move() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = paddleProps.color;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "blue";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fill();
    }
  }

  const paddle = new Paddle(paddleProps.y);
  paddle.move();
  if (paddleProps.y <= 0)
    paddleProps = 0;
  else if (paddleProps.y + paddleProps.height >= canvas.height)
    paddleProps.y = canvas.height - paddleProps.height;
}

export function PaddleMouv_right(ctx: any, canvas: any, paddleProps: any) {
  class Paddle {
    x: number;
    y: number;
    height: number;
    width: number;
    colors: string[];

    constructor(y: number) {
      this.x = paddleProps.x;
      this.y = y;
      this.height = paddleProps.height;
      this.width = paddleProps.width;
      this.colors = ["white", "blue"];
    }
    move() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = paddleProps.color;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "blue";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fill();
    }
  }

  const paddle = new Paddle(paddleProps.y);
  paddle.move();
  if (paddleProps.y <= 0) paddleProps = 0;
  else if (paddleProps.y + paddleProps.height >= canvas.height)
    paddleProps.y = canvas.height - paddleProps.height;
}


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

  let data = new Ball(IBall.x, IBall.y, IBall.rad);

  ctx.fillStyle = "white";
  data.draw(ctx);
}