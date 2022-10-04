import React, { useEffect } from "react";
import { socket } from "../Game";
import {
  BallMouv,
  BallCol_right,
  BallCol_left,
  PaddleMouv_left,
  PaddleMouv_right,
  draw_line,
  draw_score,
} from "./BallMouv";

import { GamePlayer_left } from "./GamePlayerLeft";
import { GamePlayer_right } from "./GamePlayerRight";
import { ballObj, paddleProps_left, paddleProps_right, player_left, player_right } from "../Game";

export function GamePlayer_Left_right(props: any) {
  let u = 0;
  useEffect(() => {

    // This useEffect is used to get the room data from the server to set the ball position and the players position

    socket.on("sincTheBall", (theroom: any) => {
      ballObj.x = theroom.set.ball.x;
      ballObj.y = theroom.set.ball.y;

      ballObj.ingame_dx = theroom.set.ball.ingame_dx;
      ballObj.ingame_dy = theroom.set.ball.ingame_dy;

      ballObj.init_dx = theroom.set.ball.init_dx;
      ballObj.init_dy = theroom.set.ball.init_dy;

      ballObj.init_first_dx = theroom.set.ball.init_first_dx;
      ballObj.init_first_dy = theroom.set.ball.init_first_dy;

      ballObj.first_dx = theroom.set.ball.first_dx;
      ballObj.first_dy = theroom.set.ball.first_dy;

      ballObj.init_ball_pos = theroom.set.ball.init_ball_pos;
      ballObj.first_col = theroom.set.ball.first_col;
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
  }, [socket]);

  // Sincronize the ball position with the server

  function sinc_ball(room_name: string, ballObj: any) {
    if (player_left.won === false && player_right.won === false) {
      var data = {
        room: room_name,
        ball: ballObj,
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
            BallMouv(ctx, ballObj, canvas.height, canvas.width);
            BallCol_left(ctx, player_right, ballObj, paddleProps_left, canvas.height, canvas.width);
            if (ballObj.is_col === true)
              u = 1;
            BallCol_right(ctx, player_left, ballObj, paddleProps_right, canvas.height, canvas.width);
            if (ballObj.is_col === true || ballObj.init_ball_pos === false)
              u = 1;
            if (u > 0)
              u++;
            if (u === 6){
              if (props.im_right === true && ballObj.cal_right === true)
                sinc_ball(props.room, ballObj);
              else if (props.im_right === false && ballObj.cal_right === false)
                sinc_ball(props.room, ballObj);
              sinc_player_left(props.room, player_left);
              sinc_player_right(props.room, player_right);
              u = 0;
            }
            PaddleMouv_left(ctx, canvas, paddleProps_left);
            PaddleMouv_right(ctx, canvas, paddleProps_right);
        } else {
            sinc_player_left(props.room, player_left);
            sinc_player_right(props.room, player_right);
            props.setimready(false);
            props.setopready(false);
            draw_score(ctx, player_left, player_right, canvas.height, canvas.width);
            cancelAnimationFrame(requestAnimationFrameId);
          }
        }
      };
      render();
  }, [props.canvasRef]);

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
