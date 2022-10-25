import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { socket } from "../Game";
import {
  BallMouv,
  PaddleMouv_p1,
  PaddleMouv_p2,
  draw_line,
  draw_score,
  draw_game_ended,
  draw_smasher,
  draw_paddle,
  draw_ball,
} from "./BallMouv";

/* import { ballObj, gameSpecs, paddleProps_p1, paddleProps_p2, player_p1, player_p2 } from "../Game"; */
import { ContactSupport } from "@material-ui/icons";
import { canvas_back_height, canvas_back_width, screen_ratio } from "../const/const";
import { GamePlayer_all } from "./GamePlayer_all";
import { Button } from "@mui/material";

interface IBall {
  x: number;
  y: number;
  rad : number;
}

interface IPaddle {
  x: number;
  y: number;

  height: number;
  width: number;

}

interface IPlayer {
  name: string;
  score: number;
  won: boolean;
}

let position_y = 0;


export function GamePlayer_p1_p2(props: any) {
  const [power, setpower] = useState(0);
  const [date, setdate] = useState(new Date());
  /* 
  const [IPaddle_p1, setIPaddle_p1] = useState<IPaddle>({ x: 0, y: 0 });
  const [IPaddle_p2, setIPaddle_p2] = useState<IPaddle>({ x: 0, y: 0 });

  const [IBall, setIBall] = useState<IBall>({ x: 0, y: 0 });

  const [IPlayer_p1, setIPlayer_p1] = useState<IPlayer>({ name: "", score: 0, won: false });
  const [IPlayer_p2, setIPlayer_p2] = useState<IPlayer>({ name: "", score: 0, won: false }); */

  let IPlayer_p1 : IPlayer = { name: "", score: 0, won: false };
  let IPlayer_p2 : IPlayer = { name: "", score: 0, won: false };
  let IPaddle_p1 : IPaddle = { x: 0, y: 0, height: 0, width: 0 };
  let IPaddle_p2 : IPaddle = { x: 0, y: 0, height: 0, width: 0 };
  
  let IBall : IBall = { x: 0, y: 0, rad: 0};

   enum powerEnum {
    normal = 0,
    speed = 1,
    bigball = 2,
    smach = 4,
    speed_bigball = 3,
    speed_smach = 5,
    bigball_smach = 6,
    speed_bigball_smach = 7,
  }
  
  const [lowerSize, setLowerSize] = useState((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth));
  const [HW, setdetectHW] = useState({winWidth: window.innerWidth, winHeight: window.innerHeight,})
  const detectSize = () => {
    setdetectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    })
  }
  useEffect(() => {
    window.addEventListener('resize', detectSize)
    return () => {
      window.removeEventListener('resize', detectSize)
      setLowerSize(window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
      //console.log("+++setLowerSize", lowerSize);
      socket.emit("resize_ingame", props.room);
    }
  }, [HW])

  let x = 0;
  let u = 0;
/*   useEffect(() => {

    // This useEffect is used to get the room data from the server to set the ball position and the players position

    socket.on("sincTheBall", (theroom: any) => {
      if (theroom.power === powerEnum.speed || theroom.power === powerEnum.speed_bigball
        || theroom.power === powerEnum.speed_bigball_smach || theroom.power === powerEnum.speed_bigball_smach) {
        ballObj.ingame_dx = theroom.set.ball.power_ingame_dx;
        ballObj.ingame_dy = theroom.set.ball.power_ingame_dy;
  
        ballObj.first_dx = theroom.set.ball.power_first_dx;
        ballObj.first_dy = theroom.set.ball.power_first_dy;
      }
      else {
        ballObj.ingame_dx = theroom.set.ball.ingame_dx;
        ballObj.ingame_dy = theroom.set.ball.ingame_dy;
        
        ballObj.first_dx = theroom.set.ball.first_dx;
        ballObj.first_dy = theroom.set.ball.first_dy;
      }
      if (theroom.power === 2 || theroom.power === 3
      || theroom.power === 6 || theroom.power === 7) {
        ballObj.rad = theroom.set.ball.power_rad;
      }
      else {
        ballObj.rad = theroom.set.ball.rad;
      }
      ballObj.x = theroom.set.ball.x;
      ballObj.y = theroom.set.ball.y;

      ballObj.ball_way_x = theroom.set.ball.way_x;
      ballObj.ball_way_y = theroom.set.ball.way_y;
      
      ballObj.init_ball_pos = theroom.set.ball.init_ball_pos;
      ballObj.first_col = theroom.set.ball.first_col;
      gameSpecs.power = theroom.power;
      setpower(theroom.power);
      //console.log("INGAME_power = ", theroom.power);
    });
    socket.on("mouvPaddleLeft", (theroom: any) => {
      paddleProps_p1.x = theroom.set.p1_paddle_obj.x;
      paddleProps_p1.y = theroom.set.p1_paddle_obj.y;
    });
    socket.on("mouvPaddleRight", (theroom: any) => {
      paddleProps_p2.x = theroom.set.p2_paddle_obj.x;
      paddleProps_p2.y = theroom.set.p2_paddle_obj.y;
    });
    socket.on("setDataP1", (theroom: any) => {
      player_p1.score = theroom.set.set_p1.score;
      player_p1.won = theroom.set.set_p1.won;
      player_p1.name = theroom.set.set_p1.name;
    });
    socket.on("setDataP2", (theroom: any) => {
      player_p2.score = theroom.set.set_p2.score;
      player_p2.won = theroom.set.set_p2.won;
      player_p2.name = theroom.set.set_p2.name;
    });

  }, [socket, props.setimready, props.setopready, power]);

  // Sincronize the ball position with the server

  function sinc_ball(room_name: string, ballObj: any, first: boolean) {
    console.log("!!! SINC BALL !!!!")
    if (player_p1.won === false && player_p2.won === false) {
      let data = {
        room: room_name,
        ball: ballObj,
        first: first,
        power: gameSpecs.power,
      };
      socket.emit("sincBall", data);
    }
  }
  
  // Sinchronize the paddle position with the server
  
  function sinc_player_p1(room_name: string, player_p1: any) {
    let data = {
      room: room_name,
      name: player_p1.name,
      score: player_p1.score,
      won: player_p1.won,
    };
    socket.emit("playerActyLeft", data);
  }
  
  function sinc_player_p2(room_name: string, player_p2: any) {
    let data = {
      room: room_name,
      name: player_p2.name,
      score: player_p2.score,
      won: player_p2.won,
    };
    socket.emit("playerActyRight", data);
  }
 */

  useEffect(() => {
    
    socket.on("player_give_upem", (set: any) => {
      IPlayer_p2.won = set.set_p2.won;
      IPlayer_p1.won = set.set_p1.won;

      //props.setgamestart(false);
      console.log("xxxplayer_give_upem", IPlayer_p2.won, IPlayer_p1.won);
    });

    socket.on("get_the_paddle", (set: any) => {
      
      if (!set) {
        console.log("NO SET front");
        return;
      }
    let XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
      
     const ratio_width = (XlowerSize /canvas_back_width);
     const ratio_height = (XlowerSize / (screen_ratio)) / (canvas_back_height);
    
      //console.log("set.p1_paddle_obj.y", set.p1_paddle_obj.y);
     // console.log("set.p2_paddle_obj.y", set.p2_paddle_obj.y);

      // set paddle 
      set.p1_paddle_obj.x *= ratio_width;
      set.p1_paddle_obj.y *= ratio_height;
      set.p1_paddle_obj.width *= ratio_width;
      set.p1_paddle_obj.height *= ratio_height;

      set.p2_paddle_obj.x *= ratio_width;
      set.p2_paddle_obj.y *= ratio_height;
      set.p2_paddle_obj.width *= ratio_width;
      set.p2_paddle_obj.height *= ratio_height;

      if (props.im_p2 === true)
        IPaddle_p2.y = set.p2_paddle_obj.y * ratio_height;
      else
        IPaddle_p1.y = set.p1_paddle_obj.y;

      IPaddle_p1 = set.p1_paddle_obj;
      IPaddle_p2 = set.p2_paddle_obj;
    });


    socket.on("get_the_ball", (set: any) => {
      //console.log("GET DATA SEND THE GAME");
      //let XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
      //console.log("XlowerSize", XlowerSize);

      if (!set) {
        console.log("NO SET front");
        return;
      }
     const ratio_width = (lowerSize /canvas_back_width);
     const ratio_height = (lowerSize / (screen_ratio)) / (canvas_back_height);
     
      IPlayer_p1 = set.set_p1;
      IPlayer_p2 = set.set_p2;

      IBall.x = set.ball.x * ratio_width;
      IBall.y = set.ball.y * ratio_height;
      IBall.rad = set.ball.rad * ratio_width;
    });
  }, [socket]);


    // function that emit every second to the server the game data
    
    function get_the_data(room_name: string) {
      //console.log("getting the data FRONT= ", room_name);
      socket.emit("get_the_ball", room_name);

      let data = {
        room: props.room,
        paddle_y: position_y,
        im_p2: props.im_p2,
        front_canvas_height: lowerSize / screen_ratio,
      };
      socket.emit("paddleMouv_time", data);
      //console.log("mouv_paddle_time", data.paddle_y)
      
    }

  useEffect(() => {

    let requestAnimationFrameId: any;
      //requestAnimationFrame(render);
      let canvas: any = props.canvasRef.current;
      let ctx : any = null;
      if (canvas)
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

     function draw () { 
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (IPlayer_p1.won === false && IPlayer_p2.won === false) {
          get_the_data(props.room);
          
          draw_line(ctx, canvas.height, canvas.width);
          draw_score(ctx, IPlayer_p1, IPlayer_p2, canvas.height, canvas.width);
          draw_paddle(ctx, IPaddle_p1, canvas.height, canvas.width);
          draw_paddle(ctx, IPaddle_p2, canvas.height, canvas.width);
          draw_ball(ctx, IBall, canvas.height, canvas.width);
          }
        }
      }
       setInterval(draw, 20);
    },[]);


  function deleteGameRoom_ingame() {
    if (IPlayer_p1.won === true || IPlayer_p2.won === true)
    {
      console.log("end of game");
      socket.emit("end_of_the_game", props.room);
    }
    else
   {
    console.log("give up")
    socket.emit("player_give_up", props.room);
    }
    props.setRoom("");
  }
  ////////////////////////////////////////////////////

  return (
    <div>
      <canvas
        id="canvas"
        ref={props.canvasRef}
        width={lowerSize}
        height={lowerSize / screen_ratio}
        onMouseMove={(e) => position_y = e.clientY}
        style={{ backgroundColor: "black" }}
        ></canvas>
      <br />
      <br />
      <Button
        variant="contained"
        sx={{
          backgroundColor: "black",
          color: "white",
        }}
        onClick={deleteGameRoom_ingame}
        >
        Leave The Game
      </Button>
    </div>
  );
}
