export function draw_line(
  ctx: any,
  ballObj: any,
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
    ballObj.smash = 1.7;
    ctx.fillStyle = "red";
  }
}


////////////////////////
//// BALL FUNCTIONS
////////////////////////

export function BallMouv(
  ctx: any,
  ballObj: any,
  canvas_height: number,
  canvas_width: number,
  power: number,
) {
  let data = new Ball(ballObj.x, ballObj.y, ballObj.rad);

  // if ball toutch smasher fillstyle red

/*   if ((power === 4 || power === 5 || power === 6 || power === 7) {
    ctx.fillStyle = "red";
  } else */
    ctx.fillStyle = "white";
  data.draw(ctx);

  if (ballObj.first_set === true) {
      console.log("REALY REALY FIRST SET");
      ballObj.ball_way_x = 1;
      ballObj.ball_way_y = 1;
      ballObj.first_set = false;
  }
  if (ballObj.init_ball_pos === false) {
     /*      ballObj.init_dx *= -1;
     ballObj.init_first_dx *= -1;
     
    ballObj.ingame_dx = ballObj.init_dx;
    ballObj.ingame_dy = ballObj.init_dy;

    ballObj.first_dx = ballObj.init_first_dx;
    ballObj.first_dy = ballObj.init_first_dy; */
    
    //ballObj.ball_way_x *= -1;
    ballObj.ball_way_y = 1;

    ballObj.x = ballObj.init_pos_x;
    ballObj.y = ballObj.init_pos_y;

    ballObj.ingame_dy = 6;
    //ballObj.first_dy = 2;
    ballObj.col_paddle = false;
    ballObj.init_ball_pos = true;
  }
  //console.log("ballObj.ingame_dx", ballObj.ingame_dx);
  //console.log("ballObj.ingame_dy", ballObj.ingame_dy);
  // if ball is between center - 40 and center + 40 in x
  if(ballObj.x > (canvas_width / 2) - 40 && ballObj.x < (canvas_width / 2) + 40) {
    //ballObj.smash = 3;
    ballObj.col_paddle = false;
  }
  else 
    ballObj.smash = 1;

  if (ballObj.first_col === false) {
    ballObj.x += ballObj.first_dx * ballObj.ball_way_x;
    ballObj.y += ballObj.first_dy * ballObj.ball_way_y;
  } else {
    //console.log("not first col");
    ballObj.x += ballObj.ingame_dx * ballObj.smash * ballObj.ball_way_x;
    ballObj.y += ballObj.ingame_dy * ballObj.ball_way_y;
  }

  if (ballObj.y + ballObj.rad > canvas_height || ballObj.y - ballObj.rad < 0) {
    ballObj.ball_way_y *= -1;
  }



/*   if (ballObj.y - ballObj.rad <= 0)
  {
    ballObj.ball_way_y *= -1;
    console.log("col_wall_up");
  }
    
  if (allObj.y + ballObj.rad >= canvas_height) {
    ballObj.ball_way_y *= -1;
    console.log("col_wall_down");

  } */
}

export function BallCol_left(
  ctx: any,
  player_right: any,
  ballObj: any,
  paddleProps: any,
  canvas_height: number,
  canvas_width: number
) {
  //console.log("ballObj.col_paddle = ", ballObj.col_paddle);
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

/*     let res = ballObj.y - (paddleProps.y + paddleProps.height / 2);
    ballObj.ingame_dy = -(res / 10); */

    var res = paddleProps.y + paddleProps.height - ballObj.y;
    ballObj.ingame_dy = -(res / 10 - paddleProps.height / 20);
    
    ballObj.smash = 1;
    ballObj.ball_way_y = 1;
    ballObj.ball_way_x *= -1;

    ballObj.first_col = true;
    ballObj.col_paddle = true;
    ballObj.col_now_paddle = true;
  }

}

export function BallCol_right(
  ctx: any,
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

/*     var res = ballObj.y - (paddleProps.y + paddleProps.height / 2);
    ballObj.ingame_dy = res / 10; */

    var res = paddleProps.y + paddleProps.height - ballObj.y;
    ballObj.ingame_dy = -(res / 10 - paddleProps.height / 20);


    ballObj.smash = 1;
    ballObj.ball_way_y = 1;
    ballObj.ball_way_x *= -1;

    ballObj.first_col = true;
    ballObj.col_paddle = true;
    ballObj.col_now_paddle = true;
    console.log("col_paddle");
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
