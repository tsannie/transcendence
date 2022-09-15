import React, { useEffect } from "react";
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

export function The_whole_game(canvasRef: any) {
  let u = 0;
  useEffect(() => {
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
    });
    socket.on("setDataPlayerRight", (theroom: any) => {
      player_right.score = theroom.set.set_p2.score;
      player_right.won = theroom.set.set_p2.won;
    });
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
    if (player_left.won === false && player_right.won === false) {
      var data = {
        room: room_name,
        name: player_left.name,
        score: player_left.score,
        won: player_left.won,
      };
      console.log("room_name ", room_name);
      console.log("player left sinc ");
    
      socket.emit("playerActyLeft", data);
    }
  }
  
  function sinc_player_right(room_name: string, player_right: any) {
    if (player_left.won === false && player_right.won === false) {
      var data = {
        room: room_name,
        name: player_right.name,
        score: player_right.score,
        won: player_right.won,
      };
      console.log("room_name ", room_name);
      console.log("player right sinc ");
      socket.emit("playerActyRight", data);
    }
  }
  let x = 1;
  useEffect(() => {
    socket.on("startGame", (theroom: any) => {
      sinc_player_left(theroom.room_name, player_left);
      sinc_player_right(theroom.room_name, player_right);
      player_left.name = theroom.set.set_p1.name;
      player_right.name = theroom.set.set_p2.name;
      sinc_ball(theroom.room_name, ballObj);
      const render = () => {
        const canvas: any = canvasRef.current;
        var ctx = null;
        if (canvas)
          ctx = canvas.getContext("2d");
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
            if (u === 6) {
              sinc_ball(theroom.room_name, ballObj);
              sinc_player_left(theroom.room_name, player_left);
              sinc_player_right(theroom.room_name, player_right);
              u = 0;
            }
            PaddleMouv_left(ctx, canvas, paddleProps_left);
            PaddleMouv_right(ctx, canvas, paddleProps_right);
          } else {
            draw_score(
              ctx,
              player_left,
              player_right,
              canvas.height,
              canvas.width
            );
          }
          requestAnimationFrame(render);
        }
      };
      render();
    });
  }, [socket]);
}
