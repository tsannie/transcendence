import { exit } from "process";
import React, { createRef, useEffect, useRef, useState } from "react";
import {
  ballObj,
  paddleProps_left,
  paddleProps_right,
  player_left,
  player_right,
  socket,
} from "../Game";
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

export function GamePlayer_Left_right(props: any) {

  let u = 0;
  useEffect(() => { // TODO EMIT IS SENDING TO MANY TIMES
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
      console.log("ball is sinc with server");
    });
    socket.on("mouvPaddleLeft", (theroom: any) => {
      paddleProps_left.x = theroom.set.p1_padle_obj.x;
      paddleProps_left.y = theroom.set.p1_padle_obj.y;
    });
    socket.on("mouvPaddleRight", (theroom: any) => {
      paddleProps_right.x = theroom.set.p2_padle_obj.x;
      paddleProps_right.y = theroom.set.p2_padle_obj.y;
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
    });

/*     socket.on("leftbcgiveup", (theroom: any) => {
      console.log("leftbcgiveup FRONT GAME");
      props.deleteGameRoom();
    });
 */
  }, [socket]);

  function sinc_ball(room_name: string, objball: any) {
    if (player_left.won === false && player_right.won === false) {
      var data = {
        room: room_name,
        ball: objball,
      };
      socket.emit("sincBall", data);
    }
  }

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

  let requestAnimationFrameId: any;
  useEffect(() => {
      sinc_player_left(props.store.room, player_left);
      sinc_player_right(props.store.room, player_right);
      sinc_ball(props.store.room, ballObj);
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
            draw_score(
              ctx,
              player_left,
              player_right,
              canvas.height,
              canvas.width
            );
            BallMouv(ctx, ballObj, canvas.height, canvas.width);
            BallCol_left(
              ctx,
              player_right,
              ballObj,
              paddleProps_left,
              canvas.height,
              canvas.width
            );
            if (ballObj.is_col === true)
              u = 1;
            BallCol_right(
              ctx,
              player_left,
              ballObj,
              paddleProps_right,
              canvas.height,
              canvas.width
            );
            if (ballObj.is_col === true || ballObj.init_ball_pos === false)
              u = 1;
            if (u > 0)
              u++;
            if (u === 12) {
              sinc_ball(props.store.room, ballObj);
              sinc_player_left(props.store.room, player_left);
              sinc_player_right(props.store.room, player_right);
              u = 0;
            }
            PaddleMouv_left(ctx, canvas, paddleProps_left);
            PaddleMouv_right(ctx, canvas, paddleProps_right);
          } else {
            sinc_player_left(props.store.room, player_left);
            sinc_player_right(props.store.room, player_right);
            draw_score(
              ctx,
              player_left,
              player_right,
              canvas.height,
              canvas.width
            );
            cancelAnimationFrame(requestAnimationFrameId);
          }
        }
      };
      render();
  }, [props.canvasRef]);

  function deleteGameRoom_ingame() { 
    console.log("player_left.won ", player_left.won);
    console.log("player_right.won ", player_right.won);
    props.store.setRoom("");
    if (player_left.won == true || player_right.won == true) {
      console.log("end_of_game");
      socket.emit("end_of_the_game", props.store.room);
    }
    else {
      console.log("player_give_up");
      socket.emit("player_give_up", props.store.room);
    }
  }
  ////////////////////////////////////////////////////

  if (props.store.im_right === true) {
    return (
      <GamePlayer_right
        setRoom={props.store.setRoom}
        canvasRef={props.canvasRef}
        deleteGameRoom={props.deleteGameRoom}
        deleteGameRoom_ingame={deleteGameRoom_ingame}
        gamestart={props.store.gamestart}
        im_right={props.store.im_right}
        my_id={props.store.my_id}
        op_id={props.store.op_id}
        room={props.store.room}
      />
    );
  }
  return (
      <GamePlayer_left
        setRoom={props.store.setRoom}
        canvasRef={props.canvasRef}
        deleteGameRoom={props.deleteGameRoom}
        deleteGameRoom_ingame={deleteGameRoom_ingame}
        gamestart={props.store.gamestart}
        im_right={props.store.im_right}
        my_id={props.store.my_id}
        op_id={props.store.op_id}
        room={props.store.room}
      />
  ); 
}
