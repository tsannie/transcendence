
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
    player_left.score.toString() +
      "     " +
    player_right.score.toString(),
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

export function BallMouv(
  ctx: any,
  ballObj: any,
  canvas_height: number,
  canvas_width: number
) {
  let data = new Ball(ballObj.x, ballObj.y, ballObj.rad);
  data.draw(ctx);

  if (ballObj.init_ball_pos === false) {
    ballObj.init_dx *= -1;
    ballObj.init_first_dx *= -1;

    ballObj.ingame_dx = ballObj.init_dx;
    ballObj.ingame_dy = ballObj.init_dy;

    ballObj.x = ballObj.init_x;
    ballObj.y = ballObj.init_y;

    ballObj.first_dx = ballObj.init_first_dx;
    ballObj.first_dy = ballObj.init_first_dy;

    ballObj.init_ball_pos = true;
  }

  if (ballObj.first_col === false) {
    console.log("ballObj.x : " + ballObj.x);
    console.log("ballObj.y : " + ballObj.y);
    ballObj.x += ballObj.first_dx;
    ballObj.y += ballObj.first_dy;
  } else {
    ballObj.x += ballObj.ingame_dx;
    ballObj.y += ballObj.ingame_dy;
  }

  if (
    ballObj.y - ballObj.rad <= 2 ||
    ballObj.y + ballObj.rad >= canvas_height - 2
  ) {
    ballObj.first_dy *= -1;
    ballObj.ingame_dy *= -1;
  }
}

export function BallCol_left(
  ctx: any,
  player_right: any,
  ballObj: any,
  paddleProps: any,
  canvas_height: number,
  canvas_width: number
) {
  if (ballObj.x - ballObj.rad <= -50) {
    ballObj.first_col = false;
    ballObj.init_ball_pos = false;
    player_right.score += 1;
  } else if (player_right.score >= 100) {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    player_right.won += 1;
  } else if (
    ballObj.x - ballObj.rad - paddleProps.width - paddleProps.x <= 0 &&
    ballObj.y >= paddleProps.y &&
    ballObj.y <= paddleProps.y + paddleProps.height &&
    ballObj.x >= paddleProps.x
  ) {
    ballObj.first_col = true;

    var res = paddleProps.y + paddleProps.height - ballObj.y;
    res = res / 10 - paddleProps.height / 20;

    ballObj.ingame_dy = -res;
    ballObj.ingame_dx *= -1;

    ballObj.is_col = true;
  } else ballObj.is_col = false;
}

export function BallCol_right(
  ctx: any,
  player_left: any,
  ballObj: any,
  paddleProps: any,
  canvas_height: number,
  canvas_width: number
) {
  if (ballObj.x + ballObj.rad >= canvas_width + 50) {
    ballObj.first_col = false;
    ballObj.init_ball_pos = false;
    player_left.score += 1;
  } else if (player_left.score >= 100) {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    player_left.won += 1;
  } else if (
    ballObj.x +
      ballObj.rad +
      paddleProps.width +
      (canvas_width - paddleProps.x - paddleProps.width) >=
      canvas_width &&
    ballObj.y >= paddleProps.y &&
    ballObj.y <= paddleProps.y + paddleProps.height &&
    ballObj.x <= paddleProps.x + paddleProps.width
  ) {
    ballObj.first_col = true;
    var res = paddleProps.y + paddleProps.height - ballObj.y;
    res = res / 10 - paddleProps.height / 20;

    ballObj.ingame_dy = -res;
    ballObj.ingame_dx *= -1;
    ballObj.is_col = true;
  } else ballObj.is_col = false;
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
  if (paddleProps.y <= 0) paddleProps = 0;
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
