import React, { useEffect, useRef, useState } from "react";
import "./Game.css";
import io from "socket.io-client";
import { start } from "repl";
import { render } from "@testing-library/react";
import FtClock from "./Clock";
import InGame from "./inGame";
import { BallMouv, BallCol_right, BallCol_left, PaddleMouv_left, PaddleMouv_right, draw_line, draw_score } from "./BallMouv";
import data from './BallMouv';
const socket = io("http://localhost:4000/game");

socket.on("connect_error", (err) => {
  console.log(`|||||||||||connect_error due to ${err.message}`);
  
});


function Theclock(){
  const [date, setDate] = useState(new Date());
  
  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);
  return (
    <p>
      {date.toLocaleTimeString()}
    </p>
  );
}

export default function Game() {
  const [nbrconnect, setnbrconnect] = useState(0);
  const [room, setRoom] = useState("");

  const [color_ready, setColor_ready] = useState("");
  const [my_id, setmy_id] = useState(socket.id);
  const [op_id, setop_id] = useState("2");
  const [im_right, setim_right] = useState(false);


  const [isfull, setisFull] = useState("");
  const [isinroom, setisinroom] = useState(false);

  const [imready, setimready] = useState(false);
  const [opready, setopready] = useState(false);
  const [PP_empty, setPP_empty] = useState("");

  const [mytimer, setmytimer] = useState(new Date());
  let {ballObj, player_left, player_right, paddleProps_left, paddleProps_right} = data;


  /*   socket.on("connect", function () {
    console.log("CONNECT IO")
    const sessionID = socket.id; //
    setmy_id(socket.id);
  }); */

  function createGameRoom() {
    if (room == "")
      setPP_empty("INVALID ROOM NAME");
    else if (isinroom == false) {
      socket.emit("createGameRoom", room);
      //console.log(`--front--User create room [${room}]`);
    }
  }

  function createFastGameRoom() {
    setRoom("");
    if (isinroom == false) {
      socket.emit("createGameRoom", room);
      //console.log(`--front--User create FAST room [${room}]`);
    }
  }

  function deleteGameRoom() {
    if (isinroom == true) {
      setisinroom(false);
      socket.emit("leaveGameRoom", room);
      //console.log(`--front--User leave room [${room}]`);
      setRoom("");
    }
  }

  function ReadyGame() {
    setColor_ready("green");
    socket.emit("readyGameRoom", room);
    //console.log(`--player ready`);
  }

  function SendPaddleMouv(p1paddle: object, p2paddle: object) {
    var data={  
      rom : room,
      pd2 : p2paddle,  
      pd3 : p1paddle  
      };

    //console.log(p1paddle, p2paddle);
    socket.emit("paddleMouv", data);
  }

  function StartGame(rom : string) {
    
    socket.emit("startGameRoom", rom);
  }

  useEffect(() => {
    socket.on("readyGame", (theroom) => {
      setColor_ready("green");
      if (
        (theroom.p2 == socket.id && theroom.p2_ready == true) ||
        (theroom.p1 == socket.id && theroom.p1_ready == true)
      )
        setimready(true);
      if (
        (theroom.p1 != socket.id && theroom.p1_ready == true) ||
        (theroom.p2 != socket.id && theroom.p2_ready == true)
      )
        setopready(true);
      if (theroom.p1_ready == true && theroom.p2_ready == true)
      {
        setmytimer(theroom.thedate);
        //console.log("DATE : " + mytimer + " DATE : " + theroom.thedate);
        //setball_speed(theroom.set.ball.speed);
        //setball_color(theroom.set.ball.color);
        //console.log("rom : " + theroom.room_name);
        setRoom(theroom.room_name);
       // console.log("rom : " + room);
        StartGame(theroom.room_name);
      }
        //console.log("me : " + imready + " op : " + opready);
    });

    socket.on("joinedRoom", (theroom) => {
      setnbrconnect(theroom.nbr_co);
      setisinroom(true);
     // if (theroom.p2 == my_id)
        setRoom(theroom.room_name);
      if (theroom.p2 == socket.id)
      {
          setop_id(theroom.p1);
          setim_right(true);
      }
      else if (theroom.p1 == socket.id)
        setop_id(theroom.p2);
      console.log(
        "recu le msg from back de : " + theroom.nbr_co + " == " + nbrconnect
      );
    });

    socket.on("leftRoom", (theroom) => {
      setnbrconnect(theroom.nbr_co);
      setopready(false);
      setimready(false);
      setop_id("");
    });

    setisFull("");
    setmy_id(socket.id);
    socket.on("roomFull", (theroom) => {
      setisFull("This ROOM IS FULL MATE");
      console.log("THIS ROOM IS FULL");
    });
  }, [socket]);

  //console.log("nbr co == " + nbrconnect);
  //console.log("me : " + imready + " op : " + opready);
  //console.log("op id == " + op_id);



  ///////////////////////////////INGAME
/*   const [timecount, setimecount] = useState(new Date());

   function start_timer() {
    socket.emit("startTimerRoom", room);
  } 

    function refreshClock() {
      var tt = new Date();
      var bb = tt.getTime() - mytimer.getTime();
      setimecount(new Date(bb));
    }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 100);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []); */
    
    const [ball_speed, setball_speed] = useState(0);
  const [ball_color, setball_color] = useState("blue");

  let x = 0;
  let speed = 10;
  let color = "blue"
  let is_emited = 0;
  console.log("ici ");
  const canvasRef = useRef(null);

  useEffect(() => {
      socket.on("startGame", (theroom) => {
        
        //console.log("im right ? = " + im_right);

        player_left.name = theroom.set.set_p1.name;
        player_right.name = theroom.set.set_p2.name;

        //console.log("ici 1 ");
        const render = () => {
       // console.log("ici 2 ");

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

              SendPaddleMouv(paddleProps_left, paddleProps_right);
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

          }//
          //console.log("11111")
        };
       // console.log("22222")
        render();
       // console.log("33333")
      //  console.log("44444")
    });
  }, [socket]);
   // console.log("----")
    

/* 
    function keyDown(e: any) {

     // console.log( e.keyCode )
      console.log( e.keyCode )
      if (e.keyCode == 38)
        paddleProps.y -= 10;
      if (e.keyCode == 40)
        paddleProps.y += 10;
      
      }

  window.addEventListener('keydown', keyDown);
  //window.addEventListener('keyup', keyUp); */

  ///////////////////////////////INGAME

  /////////////////////////////////////
  if (nbrconnect == 2 && isinroom && opready == true && imready == true && im_right == true) {
    return (
      <div className="readyGame">

         <canvas
        id="canvas"
        ref={canvasRef}
        height="500px"
        width={1000}
        onMouseMove={(e) => (paddleProps_right.y = e.clientY  - (paddleProps_right.width / 2) - 15 ) }
        style={{ backgroundColor: 'black' }}>
        </canvas>

        <h1 style={{ color: "blue" }}> you are : {my_id} </h1>
         <h2 style={{ color: "red" }}> opponent is : {op_id} </h2>
        <button onClick={deleteGameRoom}>leave room {room}</button>
{/* //////////////// */}
        {/* {start_timer()} */}
         <p>time played =</p>
        <p>zzzz = </p>


      </div>
    );
  } else if (nbrconnect == 2 && isinroom && opready == true && imready == true && im_right == false) {
    
    return (
      <div className="readyGame">

         <canvas
        id="canvas"
        ref={canvasRef}
        height="500px"
        width={1000}
        onMouseMove={(e) => (paddleProps_left.y = e.clientY  - (paddleProps_left.width / 2) - 15 ) }
        style={{ backgroundColor: 'black' }}>
        </canvas>

        <h1 style={{ color: "blue" }}> you are : {my_id} </h1>
         <h2 style={{ color: "red" }}> opponent is : {op_id} </h2>
        <button onClick={deleteGameRoom}>leave room {room}</button>
{/* //////////////// */}
        {/* {start_timer()} */}
         <p>time played =</p>
        <p>zzzz = </p>


      </div>
    );
  } else if (nbrconnect == 2 && isinroom) {
    return (
      <div className="readytoplay">
{/*                 <canvas
        id="canvas"
        ref={canvasRef}
        height="500px"
        width={1000}
        onMouseMove={(e) => (paddleProps_left.y = e.clientY  - (paddleProps_left.width / 2) - 15 )+
                            (paddleProps_right.y = e.clientY  - (paddleProps_right.width / 2) - 15 ) }
        style={{ backgroundColor: 'black' }}>
        </canvas> */}
        <h2> you are : {my_id} </h2>
        <p> THE ROOM "{room}" IS READY TO PLAY </p>
        <button onClick={deleteGameRoom}>leave room {room}</button>
        <button style={{ color: color_ready }} onClick={ReadyGame}>
          {" "}
          READY ? {room}
        </button>

        <b>
          {opready ? (
            <h2 style={{ color: color_ready }}> opponent {op_id} is ready </h2>
          ) : (
            <h2> waiting for : {op_id} </h2>
          )}
        </b>
      </div>
    );
  } else if (isinroom == true) {
    return (
      <div className="queues">
        
        <h2> you are : {my_id} </h2>

        <p> waiting for opponent in room {room} </p>
        <button onClick={deleteGameRoom}>leave room {room}</button>
      </div>
    );
  } else {
    return (
      <div className="Game"> 

{/*     <canvas
        id="canvas"
        ref={canvasRef}
        height="500px"
        width={1000}
        onMouseMove={(e) => (paddleProps_left.y = e.clientY  - (paddleProps_left.width / 2) - 15 )+
                            (paddleProps_right.y = e.clientY  - (paddleProps_right.width / 2) - 15 ) }
        style={{ backgroundColor: 'black' }}>
        </canvas> */}

        <h2> you are : {my_id} </h2>

        <h4> Invite un ami a jouer</h4>
        <input
          type="text"
          placeholder="username"
          id="room"
          onChange={(event) => {
            setRoom(event.target.value);
          }}>
          </input>
        <button onClick={createGameRoom}>PARTIE PERSONALISE</button>
        <p>{PP_empty}</p>
        <br />
        <h4> partie classee</h4>

        <button onClick={createFastGameRoom}>PARTIE RAPIDE</button>

        <p style={{ color: "red" }}> {isfull} </p>

        {/* {InGame()} */}



      </div>
    );
  }
}