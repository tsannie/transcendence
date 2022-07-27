export default {
  ballObj : {
    x: 500,
    y: 500,
    dx: 8,
    dy: 6,
    rad: 10,
    speed: 10,
    right: true,
    down: true,
  },
  brickObj: {
    x: 0.5,
    y: 50,
    width: 1000 / 10-1,
    heigth: 20,
    density: 2,
    colors: ["blue", "lightblue"],
  },

  paddleProps_left: {
    height: 100,
    width: 20,
    color: "white",
    x: 0,
    y: 5,
  },
  paddleProps_right: {
    height: 100,
    width: 20,
    color: "white",
    x: 1000 - 20,
    y: 5,
  },


  player_left: {
    name: "player left",
    lives: 5,
    score: 0,
  },
  player_right: {
    name: "player right",
    lives: 5,
    score: 0,
  },
};



export function draw_line(ctx : any, ballObj : any, canvas_height: number, canvas_width: number) {

  ctx.beginPath();

  for (let x = 10; x < canvas_height - 10; x += 40)
    ctx.rect(canvas_width / 2, x, 6, 30);
  ctx.fillStyle = "white";
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "grey";
 // ctx.strokeRect(10, 10, 10, canvas_height / 2);
  ctx.fill();


}

export function draw_score(ctx : any, player_left : any, player_right : any,canvas_height: number, canvas_width: number) {

  ctx.beginPath();


  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText(player_left.name + " " + player_left.score.toString(), canvas_width/2, canvas_height / 4);

  ctx.textAlign = "right";
  ctx.fillText(player_right.name + " " + player_right.score.toString(), canvas_width/2, canvas_height / 4);

  ctx.fill();
}

export function BallMouv(ctx : any, ballObj : any, canvas_height: number, canvas_width: number) {
  let data = new Ball(ballObj.x, ballObj.y, ballObj.rad)
  data.draw(ctx);
  ballObj.x += ballObj.dx;
  ballObj.y += ballObj.dy;

  if (ballObj.y - ballObj.rad <= 0 ||
    ballObj.y + ballObj.rad >= canvas_height)
      ballObj.dy *= -1;

}

export function BallCol_left(ctx : any, player_right: any,ballObj : any, paddleProps: any, canvas_height: number, canvas_width: number) {
 
  if (ballObj.x - ballObj.rad - paddleProps.width <= 0 && 
      ballObj.y > paddleProps.y &&
      ballObj.y < paddleProps.y + paddleProps.height)
    ballObj.dx *= -1;

  if (ballObj.x - ballObj.rad <= 0)
  {
    ballObj.x = 500;
    ballObj.y = 500;
    ballObj.dx = 8;
    ballObj.dy = 6;
    player_right.score += 1;
    console.log("PERDU left");
  }

}

export function BallCol_right(ctx : any, player_left: any, ballObj : any, paddleProps: any, canvas_height: number, canvas_width: number) {
/*   if (ballObj.x - ballObj.rad - paddleProps.width <= 0 && 
      ballObj.y > paddleProps.y &&
      ballObj.y < paddleProps.y + paddleProps.height)
    ballObj.dx *= -1; */

    if (ballObj.x + ballObj.rad + paddleProps.width >= canvas_width && 
      ballObj.y > paddleProps.y &&
      ballObj.y < paddleProps.y + paddleProps.height)
    ballObj.dx *= -1;

    if (ballObj.x + ballObj.rad >= canvas_width)
    {
      ballObj.x = 500;
      ballObj.y = 500;
      ballObj.dx = -8;
      ballObj.dy = -6;
      player_left.score += 1;
      console.log("PERDU right");
    }
}

class Ball {
  x : number;
  y : number;
  rad : number;

  constructor(x : number, y : number, rad : number) {
    this.x = x;
    this.y = y;
    this.rad = rad;
  }
  draw(ctx : any) {
    ctx.beginPath();
    ctx.fillStryle = "blue";
    ctx.arc(this.x, this.y, this.rad, 0, 2 *Math.PI)
    ctx.strokeStyle = "black";
    ctx.strokeWidth = 10;
    ctx.fill();
    ctx.stroke();
  }
}


export function PaddleMouv_left(ctx : any, canvas : any, paddleProps: any) {
  class Paddle {
    x : number;
    y : number;
    height : number;
    width: number;
    colors: string[];
  
    constructor(y : number) {
      this.x = paddleProps.x;
      this.y = y;
      this.height = paddleProps.height;
      this.width = paddleProps.width;
      this.colors = ["white", "blue"];
    }
      move() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      //ctx.fillStyle = this.broke ? "white" : this.coolor[1];
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


export function PaddleMouv_right(ctx : any, canvas : any, paddleProps: any) {
  class Paddle {
    x : number;
    y : number;
    height : number;
    width: number;
    colors: string[];
  
    constructor(y : number) {
      this.x = paddleProps.x;
      this.y = y;
      this.height = paddleProps.height;
      this.width = paddleProps.width;
      this.colors = ["white", "blue"];
    }
      move() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      //ctx.fillStyle = this.broke ? "white" : this.coolor[1];
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