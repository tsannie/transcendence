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
} from "./BallMouv";

import { GamePlayer_left } from "./GamePlayerLeft";
import { GamePlayer_right } from "./GamePlayerRight";
import { ballObj, paddleProps_left, paddleProps_right, player_left, player_right } from "../Game";
import { ContactSupport } from "@material-ui/icons";

export function GamePlayer_Left_right(props: any) {
  const [power, setpower] = useState(0);
  const [date, setdate] = useState(new Date());
  
  let x = 0;
  let u = 0;
  useEffect(() => {

    // This useEffect is used to get the room data from the server to set the ball position and the players position

    socket.on("sincTheBall", (theroom: any) => {
      if (theroom.power === 1 || theroom.power === 3
        || theroom.power === 5 || theroom.power === 7) {
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
    if (player_left.won === false && player_right.won === false) {
      var data = {
        room: room_name,
        ball: ballObj,
        first: first,
        power: power,
      };
      socket.emit("sincBall", data);
    }
  }

  // Sinchronize the paddle position with the server

  function sinc_player_left(room_name: string, player_left: any) {
    var data = {
      room: room_name,
      name: player_left.name,
      score: player_left.score,
      won: player_left.won,
    };
    socket.emit("playerActyLeft", data);
  }

  function sinc_player_right(room_name: string, player_right: any) {
    var data = {
      room: room_name,
      name: player_right.name,
      score: player_right.score,
      won: player_right.won,
    };
    socket.emit("playerActyRight", data);
  }

  // This useEffect is used to draw the canvas
  let requestAnimationFrameId: any;
  useEffect(() => {
      sinc_ball(props.room, ballObj, true);
      ballObj.first_set = true;
      const render = () => {
        requestAnimationFrameId = requestAnimationFrame(render);
        let canvas: any = props.canvasRef.current;
        var ctx = null;
        if (canvas)
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (player_left.won === false && player_right.won === false) {
            draw_line(ctx, ballObj, canvas.height, canvas.width);
            draw_score(ctx, player_left, player_right, canvas.height, canvas.width);

            if (power === 4 || power === 5
            || power === 6 || power === 7) {
              //console.log("DRAWWWWWW POWEEEERRRR = ", power);
              draw_smasher(ctx, ballObj, canvas.height, canvas.width);
            }
            BallMouv(ctx, ballObj, canvas.height, canvas.width, power);
            BallCol_left(ctx, player_right, ballObj, paddleProps_left, canvas.height, canvas.width);

            BallCol_right(ctx, player_left, ballObj, paddleProps_right, canvas.height, canvas.width);
            if (ballObj.col_now_paddle === true || u === 50) {
              sinc_ball(props.room, ballObj, false);
              ballObj.col_now_paddle = false;
              u = 0;
            }
            u++;
            PaddleMouv_left(ctx, canvas, paddleProps_left);
            PaddleMouv_right(ctx, canvas, paddleProps_right);
        } else {
            sinc_player_left(props.room, player_left);
            sinc_player_right(props.room, player_right);
            props.setimready(false);
            props.setopready(false);
            draw_game_ended(props.im_right, ctx, player_left, player_right, canvas.height, canvas.width);
            draw_score(ctx, player_left, player_right, canvas.height, canvas.width);
            cancelAnimationFrame(requestAnimationFrameId);
          }
        }
      };
      render();
  }, [props.canvasRef, props.im_right, props.room, props.setimready, props.setopready, requestAnimationFrameId]);

  function deleteGameRoom_ingame() {
    if (player_left.won === true || player_right.won === true)
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
