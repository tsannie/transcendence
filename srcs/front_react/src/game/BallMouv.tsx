export default {
  ballObj : {
    x: 500,
    y: 250,

    init_ball_pos: false,

    first_col: false,
    rad: 10,
    speed: 10,
    right: true,
    down: true,
    is_col: false,

    init_x: 500,
    init_y: 250,

    init_dx: 4,
    init_dy: 6,

    init_first_dx: 1,
    init_first_dy: 2,

    first_dx: 1,
    first_dy: 2,

    ingame_dx: 4,
    ingame_dy: 6,



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
    won: false,
  },
  player_right: {
    name: "ddjian",
    lives: 5,
    score: 0,
    toutch: 0,
    won: false,
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


  if (ballObj.init_ball_pos == false) { //INIT BALL POSTITION SENS
  
    ballObj.ingame_dx = ballObj.init_dx;
    ballObj.ingame_dy = ballObj.init_dy;
    
    ballObj.x = ballObj.init_x;
    ballObj.y = ballObj.init_y;

    ballObj.first_dx = ballObj.init_first_dx;
    ballObj.first_dy = ballObj.init_first_dy;

    ballObj.init_ball_pos = true;
    //console.log ("init_ball sure ")
  } 

  if (ballObj.first_col == false) { // SNES PREMIER COUP/
    //console.log("first tap");
    
    ballObj.x += ballObj.first_dx;
    ballObj.y += ballObj.first_dy;

    
  }
  else {    // SENS INGAME//
    ballObj.x += ballObj.ingame_dx;
    ballObj.y += ballObj.ingame_dy;
  }

  // colision mur haut/bas
  if (ballObj.y - ballObj.rad <= 0 ||
    ballObj.y + ballObj.rad >= canvas_height) {
      //ballObj.dy *= -1;
      ballObj.first_dy *= -1; // change le sens de la balle du premier tire
      ballObj.ingame_dy *= -1;
    // ballObj.is_col = true;//
  }
}

export function BallCol_left(ctx : any, player_right: any,ballObj : any, paddleProps: any, canvas_height: number, canvas_width: number) {
 
  if (ballObj.x - ballObj.rad <= paddleProps.width)
  {


    ballObj.first_col = false;
    ballObj.init_ball_pos = false;

    player_right.score += 1;
    console.log("PERDU left");
  }
  else if (player_right.score >= 100)
  {
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    //ctx.fillText(player_right.name + " WON !!!",canvas_width/2, canvas_height / 2);
    player_right.won += 1;
    //ballObj.dx = 0;
    //ballObj.dy = 0; 
  }
  else if (ballObj.x - ballObj.rad - paddleProps.width - paddleProps.x <= 0 && 
      ballObj.y >= paddleProps.y &&
      ballObj.y <= paddleProps.y + paddleProps.height) {
    //ballObj.dx *= -1;
    ballObj.first_col = true;
    
    var res = (paddleProps.y + paddleProps.height) - ballObj.y;
    res = (res/10) - (paddleProps.height / 20);

    ballObj.ingame_dy = -res;
    ballObj.ingame_dx *= -1;

    ballObj.is_col = true;
  }
  else
    ballObj.is_col = false;


}

export function BallCol_right(ctx : any, player_left: any, ballObj : any, paddleProps: any, canvas_height: number, canvas_width: number) {
    if (ballObj.x + ballObj.rad >= canvas_width - paddleProps.width) {
    
      ballObj.first_col = false;
      ballObj.init_ball_pos = false;
    
      player_left.score += 1;
      console.log("PERDU right");
    }
    else if (player_left.score >= 100) {
      ctx.font = "30px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      player_left.won += 1;
      //ballObj.dx = 0;
      //ballObj.dy = 0;
    }
    else if (ballObj.x + ballObj.rad + paddleProps.width + (canvas_width - paddleProps.x - paddleProps.width) >= canvas_width && 
        ballObj.y >= paddleProps.y &&
        ballObj.y <= paddleProps.y + paddleProps.height) {
      //ballObj.dx *= -1;
      ballObj.ingame_dx *= -1;
      ballObj.first_col = true;
      var res = (paddleProps.y + paddleProps.height) - ballObj.y;
      res = (res/10) - (paddleProps.height / 20); 
      ballObj.ingame_dy = -res;
      
     // console.log("paddle right x = " + paddleProps.x);
     // console.log("paddle right y = " + paddleProps.y);
     console.log(ballObj.x + ballObj.rad );
     console.log(">=");
     console.log(canvas_width);
      ballObj.is_col = true;
    }
    else
      ballObj.is_col = false;

    


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
    width : number;
    colors : string[];
  
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