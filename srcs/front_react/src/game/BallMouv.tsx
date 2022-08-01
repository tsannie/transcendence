export default {
  ballObj : {
    x: 200,
    y: 200,
    dx: 2,
    dy: 2,
    first_dx: 1,
    first_dy: 2,
    first_col: false,
    rad: 10,
    speed: 10,
    right: true,
    down: true,
  },

  paddleProps_left: {
    height: 150,
    width: 20,
    color: "white",
    x: (20 * 2),
    y: 5,
  },
  paddleProps_right: {
    height: 150,
    width: 20,
    color: "white",
    x: 1000 - (20 * 3),
    y: 5,
  },


  player_left: {
    name: "phbarrad",
    lives: 5,
    score: 0,
    toutch: 0,
    won: 0,
  },
  player_right: {
    name: "ddjian",
    lives: 5,
    score: 0,
    toutch: 0,
    won: 0,
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
  ctx.textAlign = "center";
  
  ctx.fillText(player_left.name + " " + player_left.score.toString() + "     " +
              player_right.name + " " + player_right.score.toString(),
              canvas_width/2, canvas_height / 4);
  
  if (player_left.won == 1)
    ctx.fillText(player_left.name + " WON !!!", canvas_width / 2, canvas_height / 2);
  else if (player_right.won == 1)
    ctx.fillText(player_right.name + " WON !!!", canvas_width / 2, canvas_height / 2);
  ctx.fill();

} 

export function BallMouv(ctx : any, ballObj : any, canvas_height: number, canvas_width: number) {
  let data = new Ball(ballObj.x, ballObj.y, ballObj.rad)
  data.draw(ctx);

  if (ballObj.first_col == false) {
    ballObj.x += ballObj.first_dx;
    ballObj.y += ballObj.first_dy;
  }
  else {
    ballObj.x += ballObj.dx;
    ballObj.y += ballObj.dy;
  }
  // colision mur haut
  if (ballObj.y - ballObj.rad <= 0 ||
    ballObj.y + ballObj.rad >= canvas_height) {
      ballObj.dy *= -1;
      ballObj.first_dy *= -1;
    }


}

export function BallCol_left(ctx : any, player_right: any,ballObj : any, paddleProps: any, canvas_height: number, canvas_width: number) {
 
  if (ballObj.x - ballObj.rad - paddleProps.width - paddleProps.x <= 0 && 
      ballObj.y >= paddleProps.y &&
      ballObj.y <= paddleProps.y + paddleProps.height) {
    ballObj.dx *= -1;
    ballObj.first_dx *= -1;
    ballObj.first_col = true;

    var res = (paddleProps.y + paddleProps.height) - ballObj.y;
    res = (res/10) - (paddleProps.height / 20); 
    ballObj.dy = -res;
  }


  if (ballObj.x - ballObj.rad <= 0)
  {
    ballObj.x = 200;
    ballObj.y = 200;
    ballObj.first_col = false;

    player_right.score += 1;
    console.log("PERDU left");
  }
  if (player_right.score >= 3)
  {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    //ctx.fillText(player_right.name + " WON !!!",canvas_width/2, canvas_height / 2);
    player_right.won += 1;
    ballObj.dx = 0;
    ballObj.dy = 0;
  }

}

export function BallCol_right(ctx : any, player_left: any, ballObj : any, paddleProps: any, canvas_height: number, canvas_width: number) {
    if (ballObj.x + ballObj.rad + paddleProps.width + (canvas_width - paddleProps.x - paddleProps.width) >= canvas_width && 
        ballObj.y >= paddleProps.y &&
        ballObj.y <= paddleProps.y + paddleProps.height) {
      ballObj.dx *= -1;
      ballObj.first_dx *= -1;
      ballObj.first_col = true;

      //console.log("DY + " + ((paddleProps.y - paddleProps.height - ballObj.y) / 10));

       //console.log("ball =" + ballObj.y);

      //console.log("y1 = " + paddleProps.y);
      //console.log("height = " + paddleProps.height);

      //console.log("y2 = " + (paddleProps.y + paddleProps.height));
      console.log("---------------------");


      //console.log(paddleProps.height / 2);
      var res = (paddleProps.y + paddleProps.height) - ballObj.y;
/*       console.log("res = "  + res); 
      console.log("res/10 = "  + res/10); 
      console.log("hei = "  + paddleProps.height); 
      console.log("hei/20 = "  + paddleProps.height / 20);  */

      res = (res/10) - (paddleProps.height / 20);
      
      
      ballObj.dy = -res;


    }

    if (ballObj.x + ballObj.rad >= canvas_width)
    {
      ballObj.x = 200;
      ballObj.y = 200;
      ballObj.first_col = false;
/*       ballObj.dx = -4;
      ballObj.dy = -6; */
      player_left.score += 1;
      console.log("PERDU right");
    }
    if (player_left.score >= 3)
    {
      ctx.font = "30px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      //ctx.fillText(player_left.name + " WON !!!",canvas_width/2, canvas_height / 2);
      player_left.won += 1;
      ballObj.dx = 0;
      ballObj.dy = 0;
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