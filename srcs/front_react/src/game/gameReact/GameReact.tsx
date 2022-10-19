import React, { useEffect, useLayoutEffect, useState } from "react";
import { socket } from "../Game";
import {
  BallMouv,
  BallCol_right,
  BallCol_left,
  PaddleMouv_left,
  PaddleMouv_right,
  draw_line,
  draw_score,
  draw_game_ended,
  draw_smasher,
  draw_paddle,
  draw_ball,
} from "./BallMouv";

import { GamePlayer_left } from "./GamePlayerLeft";
import { GamePlayer_right } from "./GamePlayerRight";
/* import { ballObj, gameSpecs, paddleProps_left, paddleProps_right, player_left, player_right } from "../Game"; */
import { ContactSupport } from "@material-ui/icons";

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

export function GamePlayer_Left_right(props: any) {
  const [power, setpower] = useState(0);
  const [date, setdate] = useState(new Date());
  const [lowerSize, setLowerSize] = useState((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth));
/* 
  const [IPaddle_left, setIPaddle_left] = useState<IPaddle>({ x: 0, y: 0 });
  const [IPaddle_right, setIPaddle_right] = useState<IPaddle>({ x: 0, y: 0 });

  const [IBall, setIBall] = useState<IBall>({ x: 0, y: 0 });

  const [IPlayer_left, setIPlayer_left] = useState<IPlayer>({ name: "", score: 0, won: false });
  const [IPlayer_right, setIPlayer_right] = useState<IPlayer>({ name: "", score: 0, won: false }); */

  let IPlayer_left : IPlayer = { name: "", score: 0, won: false };
  let IPlayer_right : IPlayer = { name: "", score: 0, won: false };

  let IPaddle_left : IPaddle = { x: 0, y: 0, height: 0, width: 0 };
  let IPaddle_right : IPaddle = { x: 0, y: 0, height: 0, width: 0 };

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
      paddleProps_left.x = theroom.set.p1_paddle_obj.x;
      paddleProps_left.y = theroom.set.p1_paddle_obj.y;
    });
    socket.on("mouvPaddleRight", (theroom: any) => {
      paddleProps_right.x = theroom.set.p2_paddle_obj.x;
      paddleProps_right.y = theroom.set.p2_paddle_obj.y;
    });
    socket.on("setDataPlayerLeft", (theroom: any) => {
      player_left.score = theroom.set.set_p1.score;
      player_left.won = theroom.set.set_p1.won;
      player_left.name = theroom.set.set_p1.name;
    });
    socket.on("setDataPlayerRight", (theroom: any) => {
      player_right.score = theroom.set.set_p2.score;
      player_right.won = theroom.set.set_p2.won;
      player_right.name = theroom.set.set_p2.name;
    });

    socket.on("player_give_upem", (theroom: any) => {
      player_right.won = theroom.set.set_p2.won;
      player_left.won = theroom.set.set_p1.won;
      props.setimready(false);
      props.setopready(false);
    });
  }, [socket, props.setimready, props.setopready, power]);

  // Sincronize the ball position with the server

  function sinc_ball(room_name: string, ballObj: any, first: boolean) {
    console.log("!!! SINC BALL !!!!")
    if (player_left.won === false && player_right.won === false) {
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
  
  function sinc_player_left(room_name: string, player_left: any) {
    let data = {
      room: room_name,
      name: player_left.name,
      score: player_left.score,
      won: player_left.won,
    };
    socket.emit("playerActyLeft", data);
  }
  
  function sinc_player_right(room_name: string, player_right: any) {
    let data = {
      room: room_name,
      name: player_right.name,
      score: player_right.score,
      won: player_right.won,
    };
    socket.emit("playerActyRight", data);
  }
 */

  useEffect(() => {
    socket.on("send_the_game", (IGame: any) => {
      //console.log("GET DATA SEND THE GAME");


      console.log("lowerSize = ", lowerSize);




      if (!IGame.set) {
        console.log("NO SET front");
        return;
      }
      //setIBall(IGame.ball);
      if (!IGame.set.ball)
        console.log("NO BALL");

      if (!IGame.set.p1_paddle_obj)
        console.log("NO PADDLE_LEFT");
      if (!IGame.set.p2_paddle_obj)
        console.log("NO PADDLE_RIGHT");


      if (!IGame.set.set_p2)
        console.log("NO PLAYER_LEFT");
      if (!IGame.set.set_p1)
        console.log("NO PLAYER_RIGHT");


/*       IPlayer_left = IGame.set.set_p1;
      IPlayer_right = IGame.set.set_p2; */



      IPaddle_left = IGame.set.p1_paddle_obj;

/*       IPaddle_left.x = IGame.set.p1_paddle_obj.x;
      IPaddle_left.y = IGame.set.p1_paddle_obj.y;
      
      
      IPaddle_left.width = IGame.set.p1_paddle_obj.width;
      IPaddle_left.height = IGame.set.p1_paddle_obj.height; */

      IPaddle_left.x = (IGame.set.p1_paddle_obj.x * lowerSize) / 900;
      IPaddle_left.y = (IGame.set.p1_paddle_obj.y * (lowerSize / (16/9))) / 900;
      
      
      IPaddle_left.width = (IGame.set.p1_paddle_obj.width * lowerSize) / 900;
      IPaddle_left.height = (IGame.set.p1_paddle_obj.height * (lowerSize / (16/9))) / 900;
      
      

      



      IPaddle_right = IGame.set.p2_paddle_obj;

      IPaddle_right.x = (IGame.set.p2_paddle_obj.x * lowerSize) / 900;
      IPaddle_right.y = (IGame.set.p2_paddle_obj.y * (lowerSize / (16/9))) / 900;
      
      
      IPaddle_right.width = (IGame.set.p2_paddle_obj.width * lowerSize) / 900;
      IPaddle_right.height = (IGame.set.p2_paddle_obj.height * (lowerSize / (16/9))) / 900;

      //console.log("IPaddle_left = ", IPaddle_left);




      // console.log("P1_LOWER_SIZe", IGame.p1_lowerSize);

     // console.log("P2_LOWER_SIZe", IGame.p2_lowerSize);

     // IPaddle_left.x = IGame.set.p1_paddle_obj.x * my_ratio;

     // console.log("IPaddle_Right = ", IPaddle_right);
      //console.log("padddle RIGH = ", IGame.set.p2_paddle_obj);
      //console.log("padddle left = ", IPaddle_left);

     // console.log("IGame.set.p2_paddle_obj = ", IGame.set.p2_paddle_obj);

      //IPaddle_right.y = IGame.set.p2_paddle_obj.y;

      //console.log(" ONNN IGame.set.padddle_left = ", IGame.set.p1_paddle_obj);
/* 
      IBall.x = IGame.set.ball.x;
      IBall.y = IGame.set.ball.y;
      IBall.rad = IGame.set.ball.rad; */


      //console.log("IBall = ", IGame.set.ball);

      //setIPlayer_left(IGame.set.set_p1);
      //setIPlayer_right(IGame.set.set_p2);

     // setIPaddle_left(IGame.paddle_left);
      //setIPaddle_right(IGame.paddle_right);
    });
  }, [socket]);


    // function that emit every second to the server the game data




    function get_the_data(room_name: string) {
      //console.log("getting the data FRONT");
      socket.emit("send_the_game", room_name);
    }

  // This useEffect is used to draw the canvas
  let requestAnimationFrameId: any;
  useEffect(() => {
    const render = () => {
      requestAnimationFrameId = requestAnimationFrame(render);
      let canvas: any = props.canvasRef.current;
      let ctx = null;
      if (canvas)
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        if (x === 2) {
          //get_the_data(props.room);
          //console.log("Iplayer_left = ", IPlayer_left);

          //console.log("IPaddle_left = ", IPaddle_left);
          //console.log("Iplayer_right = ", IPlayer_right);
         x = 0;
      }
        x++;


        draw_line(ctx, canvas.height, canvas.width);
        draw_score(ctx, IPlayer_left, IPlayer_right, canvas.height, canvas.width);
        draw_paddle(ctx, IPaddle_left, canvas.height, canvas.width);
        draw_paddle(ctx, IPaddle_right, canvas.height, canvas.width);
        //draw_ball(ctx, IBall, canvas.height, canvas.width);

          //PaddleMouv_left(IPaddle_left, canvas.height, canvas.width);
          //PaddleMouv_right(IPaddle_right, canvas.height, canvas.width);
          //draw_ball(ctx, ballObj, canvas.height, canvas.width);
        }
      };
      render();
  }, [props.canvasRef, props.im_right, props.room, props.setimready, props.setopready, requestAnimationFrameId]);

  function deleteGameRoom_ingame() {
    if (IPlayer_left.won === true || IPlayer_right.won === true)
      socket.emit("end_of_the_game", props.room);
    else
      socket.emit("player_give_up", props.room);
    props.setRoom("");
  }
  ////////////////////////////////////////////////////

  if (props.im_right === true) {
    return (
      <GamePlayer_right
        setRoom={props.setRoom}
        canvasRef={props.canvasRef}
        deleteGameRoom={props.deleteGameRoom}
        deleteGameRoom_ingame={deleteGameRoom_ingame}
        im_right={props.im_right}
        opready={props.opready}
        im_ready={props.im_ready}
        my_id={props.my_id}
        op_id={props.op_id}
        room={props.room}
      />
    );
  }
  return (
    <GamePlayer_left
      setRoom={props.setRoom}
      canvasRef={props.canvasRef}
      deleteGameRoom={props.deleteGameRoom}
      deleteGameRoom_ingame={deleteGameRoom_ingame}
      im_right={props.im_right}
      opready={props.opready}
      im_ready={props.im_ready}
      my_id={props.my_id}
      op_id={props.op_id}
      room={props.room}
    />
  );
}
