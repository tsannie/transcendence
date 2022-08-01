import React, { useEffect, useRef, useState } from "react";
import { BallMouv, BallCol_right, BallCol_left, PaddleMouv_left, PaddleMouv_right, draw_line, draw_score } from "./BallMouv";
import data from './BallMouv';


import "./Game.css";
import "./Game.tsx";

let x = 0;
let {ballObj, player_left, player_right, paddleProps_left, paddleProps_right} = data;

export default function InGame() {

  const [ball_speed, setball_speed] = useState(0);
  const [ball_color, setball_color] = useState("blue");

  let x = 0;
  let speed = 10;
  let color = "blue"
  let right = true;
  let is_emited = 0;
  console.log("ici ");
  const canvasRef = useRef(null);

  useEffect(() => {
      //socket.on("readyGame", (theroom) => {

      console.log("ici 1 ");
      const render = () => {
        console.log("ici 2 ");

          const canvas: any = canvasRef.current;
          //const canvas = document.getElementById('canvas') as HTMLCanvasElement;
          var ctx = null;
          if (canvas)
            ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (player_left.won == 0 && player_right.won == 0)
            {
              draw_line(ctx, ballObj, canvas.height, canvas.width)
              draw_score(ctx, player_left, player_right,canvas.height, canvas.width)

              BallMouv(ctx, ballObj, canvas.height, canvas.width)

              BallCol_left(ctx, player_right,ballObj, paddleProps_left, canvas.height, canvas.width)
              BallCol_right(ctx, player_left,ballObj, paddleProps_right, canvas.height, canvas.width)

              PaddleMouv_left(ctx, canvas, paddleProps_left);
              PaddleMouv_right(ctx, canvas, paddleProps_right);
            }
            else
            {
              draw_score(ctx, player_left, player_right,canvas.height, canvas.width)
            }


 /*             ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, 75, 13, 0, 2 * Math.PI);
            ctx.stroke();

            //setball_speed(speed + 10);
            if (right == false)
              x -= speed;  
            else
              x += speed;
            if (x >= 800)
              right = false;  
            if (x <= 0)
              right = true;
            ctx.closePath();
            ctx.fill(); */
    
            requestAnimationFrame(render);
          //console.log("END-->")
/*             else if (x < 0){
              StartGame(theroom.room_name)
            } */

          }
          //console.log("11111")
        };
        console.log("22222")
        render();
        console.log("33333")
      console.log("44444")
  //  });
  }, []);
    console.log("----")
    

    return (
      <canvas
      id="canvas"
      ref={canvasRef}
      height={700}
      width={1400}
      onMouseMove={(e) => (paddleProps_left.y = e.clientY  - (paddleProps_left.width / 2) - 15 )+
                          (paddleProps_right.y = e.clientY  - (paddleProps_right.width / 2) - 15 ) }
      style={{ backgroundColor: 'black' }}>
      </canvas>
    );
  }

