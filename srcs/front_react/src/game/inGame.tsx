import React, { useEffect, useRef, useState } from "react";
import "./Game.css";
import "./Game.tsx";

let x = 0;
export default function InGame() {
  const [ball_speed, setball_speed] = useState(0);
  const [ball_color, setball_color] = useState("blue");

  
  let x = 0;
  let right = true;
  useEffect(()=>{
    const render = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        var ctx = null;
        if (canvas)
          ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          //ctx.fillRect(10, 10, 10, 10);
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(ball_speed + x, 75, 13, 0, 2 * Math.PI);
          ctx.stroke();
          setball_speed(ball_speed + 10);
          if (x >= 800)
            right = false;  
          if (x <= 0)
            right = true;
          if (right == false)
            x-= 10;  
          else
            x += 10;
          //if (ball_speed >= 200)
          //  setball_speed(0);
          console.log(ball_speed)
        // console.log(x)
        ctx.closePath();
        ctx.fill();

          requestAnimationFrame(render);
        }
      };
      render();
    }, [])
}
