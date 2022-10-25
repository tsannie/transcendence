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


  useEffect(() => {
    
    socket.on("player_give_upem", (set: any) => {
      IPlayer_p2.won = set.p2.won;
      IPlayer_p1.won = set.p1.won;

      //props.setgamestart(false);
      //console.log("xxxplayer_give_upem", IPlayer_p2.won, IPlayer_p1.won);
    });

    socket.on("get_the_paddle", (set: any) => {
      
      if (!set) {
        console.log("NO SET front");
        return;
      }
    let XlowerSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
      
     const ratio_width = (XlowerSize /canvas_back_width);
     const ratio_height = (XlowerSize / (screen_ratio)) / (canvas_back_height);
    
      //console.log("set.p1_paddle.y", set.p1_paddle.y);
     // console.log("set.p2_paddle.y", set.p2_paddle.y);

      // set paddle 
      set.p1_paddle.x *= ratio_width;
      set.p1_paddle.y *= ratio_height;
      set.p1_paddle.width *= ratio_width;
      set.p1_paddle.height *= ratio_height;

      set.p2_paddle.x *= ratio_width;
      set.p2_paddle.y *= ratio_height;
      set.p2_paddle.width *= ratio_width;
      set.p2_paddle.height *= ratio_height;

      if (props.im_p2 === true)
        IPaddle_p2.y = set.p2_paddle.y * ratio_height;
      else
        IPaddle_p1.y = set.p1_paddle.y;

      IPaddle_p1 = set.p1_paddle;
      IPaddle_p2 = set.p2_paddle;
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
     
      IPlayer_p1 = set.p1;
      IPlayer_p2 = set.p2;

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
