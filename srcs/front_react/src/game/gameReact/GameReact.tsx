import React, { useEffect, useLayoutEffect, useState } from "react";
import { socket } from "../Game";
import {
  BallMouv,
  BallCol_p2,
  BallCol_p1,
  PaddleMouv_p1,
  PaddleMouv_p2,
  draw_line,
  draw_score,
  draw_game_ended,
  draw_smasher,
  draw_paddle,
  draw_ball,
} from "./BallMouv";

import { GamePlayer_p1 } from "./GamePlayerLeft";
import { GamePlayer_p2 } from "./GamePlayerRight";
/* import { ballObj, gameSpecs, paddleProps_p1, paddleProps_p2, player_p1, player_p2 } from "../Game"; */
import { ContactSupport } from "@material-ui/icons";
import { canvas_back_height } from "../const/const";

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

export function GamePlayer_p1_p2(props: any) {
  const [power, setpower] = useState(0);
  const [date, setdate] = useState(new Date());
  const [lowerSize, setLowerSize] = useState((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth));
/* 
  const [IPaddle_p1, setIPaddle_p1] = useState<IPaddle>({ x: 0, y: 0 });
  const [IPaddle_p2, setIPaddle_p2] = useState<IPaddle>({ x: 0, y: 0 });

  const [IBall, setIBall] = useState<IBall>({ x: 0, y: 0 });

  const [IPlayer_p1, setIPlayer_p1] = useState<IPlayer>({ name: "", score: 0, won: false });
  const [IPlayer_p2, setIPlayer_p2] = useState<IPlayer>({ name: "", score: 0, won: false }); */

  let IPlayer_p1 : IPlayer = { name: "", score: 0, won: false };
  let IPlayer_p2 : IPlayer = { name: "", score: 0, won: false };
  const ratio = 16/9;
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
    socket.on("setDataPlayerLeft", (theroom: any) => {
      player_p1.score = theroom.set.set_p1.score;
      player_p1.won = theroom.set.set_p1.won;
      player_p1.name = theroom.set.set_p1.name;
    });
    socket.on("setDataPlayerRight", (theroom: any) => {
      player_p2.score = theroom.set.set_p2.score;
      player_p2.won = theroom.set.set_p2.won;
      player_p2.name = theroom.set.set_p2.name;
    });

    socket.on("player_give_upem", (theroom: any) => {
      player_p2.won = theroom.set.set_p2.won;
      player_p1.won = theroom.set.set_p1.won;
      props.setimready(false);
      props.setopready(false);
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
    socket.on("send_the_game", (game: any) => {
      //console.log("GET DATA SEND THE GAME");


      //console.log("lowerSize = ", lowerSize);




      if (!game) {
        console.log("NO SET front");
        return;
      }
      //setIBall(game.ball);
      if (!game.ball)
        console.log("NO BALL");

      if (!game.p1_paddle_obj)
        console.log("NO PADDLE_p1");
      if (!game.p2_paddle_obj)
        console.log("NO PADDLE_p2");


      if (!game.set_p2)
        console.log("NO PLAYER_p1");
      if (!game.set_p1)
        console.log("NO PLAYER_p2");


/*       IPlayer_p1 = game.set_p1;
      IPlayer_p2 = game.set_p2; */



      IPaddle_p1 = game.p1_paddle_obj;

/*       IPaddle_p1.x = game.p1_paddle_obj.x;
      IPaddle_p1.y = game.p1_paddle_obj.y;
      
      
      IPaddle_p1.width = game.p1_paddle_obj.width;
      IPaddle_p1.height = game.p1_paddle_obj.height; */
      
      const ratio_width = lowerSize / canvas_back_height;
      const ratio_height = (lowerSize / (ratio)) / (canvas_back_height / ratio);

      IPaddle_p1.x = game.p1_paddle_obj.x * ratio_width;
      IPaddle_p1.y = game.p1_paddle_obj.y * ratio_height;
  
      IPaddle_p1.width = game.p1_paddle_obj.width * ratio_width;
      IPaddle_p1.height = game.p1_paddle_obj.height * ratio_height;

      
      
      
      IPaddle_p2 = game.p2_paddle_obj;

      IPaddle_p2.x = game.p2_paddle_obj.x * ratio_width;
      IPaddle_p2.y = game.p2_paddle_obj.y * ratio_height;
    
      IPaddle_p2.width = game.p2_paddle_obj.width * ratio_width;
      IPaddle_p2.height = game.p2_paddle_obj.height * ratio_height;

      //console.log("IPaddle_p1 = ", IPaddle_p1);




      // console.log("P1_LOWER_SIZe", game.p1_lowerSize);

     // console.log("P2_LOWER_SIZe", game.p2_lowerSize);

     // IPaddle_p1.x = game.set.p1_paddle_obj.x * my_ratio;

     // console.log("IPaddle_p2 = ", IPaddle_p2);
      //console.log("padddle RIGH = ", game.set.p2_paddle_obj);
      //console.log("padddle left = ", IPaddle_p1);

     // console.log("game.set.p2_paddle_obj = ", game.set.p2_paddle_obj);

      //IPaddle_p2.y = game.set.p2_paddle_obj.y;

      //console.log(" ONNN game.set.padddle_p1 = ", game.set.p1_paddle_obj);
/* 
      IBall.x = game.set.ball.x;
      IBall.y = game.set.ball.y;
      IBall.rad = game.set.ball.rad; */


      //console.log("IBall = ", game.set.ball);

      //setIPlayer_p1(game.set.set_p1);
      //setIPlayer_p2(game.set.set_p2);

     // setIPaddle_p1(game.paddle_p1);
      //setIPaddle_p2(game.paddle_p2);
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
          //console.log("Iplayer_p1 = ", IPlayer_p1);

          //console.log("IPaddle_p1 = ", IPaddle_p1);
          //console.log("Iplayer_p2 = ", IPlayer_p2);
         x = 0;
      }
        x++;


        draw_line(ctx, canvas.height, canvas.width);
        draw_score(ctx, IPlayer_p1, IPlayer_p2, canvas.height, canvas.width);
        draw_paddle(ctx, IPaddle_p1, canvas.height, canvas.width);
        draw_paddle(ctx, IPaddle_p2, canvas.height, canvas.width);
        //draw_ball(ctx, IBall, canvas.height, canvas.width);

          //PaddleMouv_p1(IPaddle_p1, canvas.height, canvas.width);
          //PaddleMouv_p2(IPaddle_p2, canvas.height, canvas.width);
          //draw_ball(ctx, ballObj, canvas.height, canvas.width);
        }
      };
      render();
  }, [props.canvasRef, props.im_p2, props.room, props.setimready, props.setopready, requestAnimationFrameId]);

  function deleteGameRoom_ingame() {
    if (IPlayer_p1.won === true || IPlayer_p2.won === true)
      socket.emit("end_of_the_game", props.room);
    else
      socket.emit("player_give_up", props.room);
    props.setRoom("");
  }
  ////////////////////////////////////////////////////

  if (props.im_p2 === true) {
    return (
      <GamePlayer_p2
        setRoom={props.setRoom}
        canvasRef={props.canvasRef}
        deleteGameRoom={props.deleteGameRoom}
        deleteGameRoom_ingame={deleteGameRoom_ingame}
        im_p2={props.im_p2}
        opready={props.opready}
        im_ready={props.im_ready}
        my_id={props.my_id}
        op_id={props.op_id}
        room={props.room}
      />
    );
  }
  return (
    <GamePlayer_p1
      setRoom={props.setRoom}
      canvasRef={props.canvasRef}
      deleteGameRoom={props.deleteGameRoom}
      deleteGameRoom_ingame={deleteGameRoom_ingame}
      im_p2={props.im_p2}
      opready={props.opready}
      im_ready={props.im_ready}
      my_id={props.my_id}
      op_id={props.op_id}
      room={props.room}
    />
  );
}
