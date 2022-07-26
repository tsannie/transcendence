import React, { useEffect, useState } from "react";
import "./Game.css";
import io from "socket.io-client";
import { start } from "repl";
import { render } from "@testing-library/react";
import FtClock from "./Clock";
import InGame from "./inGame";

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
  const [isfull, setisFull] = useState("");
  const [isinroom, setisinroom] = useState(false);

  const [imready, setimready] = useState(false);
  const [opready, setopready] = useState(false);
  const [PP_empty, setPP_empty] = useState("");

  const [mytimer, setmytimer] = useState(new Date());


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

  function StartGame(rom : string) {
    socket.emit("startGameRoom", rom);
  } 


  useEffect(() => {
    socket.on("readyGame", (theroom) => {
      setColor_ready("green");
      if (
        (theroom.player_two == socket.id && theroom.player_two_ready == true) ||
        (theroom.player_one == socket.id && theroom.player_one_ready == true)
      )
        setimready(true);
      if (
        (theroom.player_one != socket.id && theroom.player_one_ready == true) ||
        (theroom.player_two != socket.id && theroom.player_two_ready == true)
      )
        setopready(true);
      if (theroom.player_one_ready == true && theroom.player_two_ready == true)
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
      setRoom(theroom.room_name);
      if (theroom.player_two == socket.id) setop_id(theroom.player_one);
      else if (theroom.player_one == socket.id) setop_id(theroom.player_two);
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
let is_emited = 0;
  useEffect(() => {
    socket.on("startGame", (theroom) => {
      const render = () => {
          const canvas = document.getElementById('canvas') as HTMLCanvasElement;
          var ctx = null;
          if (canvas)
            ctx = canvas.getContext('2d');
          if (ctx && theroom.set.ball.x < 700) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = theroom.set.ball.color;
            ctx.beginPath();
            ctx.arc(theroom.set.ball.x, 75, 13, 0, 2 * Math.PI);
            ctx.stroke();
            setball_speed(theroom.set.ball.speed + 10);
            if (theroom.set.ball.right == false)
              theroom.set.ball.x -= theroom.set.ball.speed;  
            else
              theroom.set.ball.x += theroom.set.ball.speed;
            //if (ball_speed >= 200)
            //  setball_speed(0);
            //console.log(ball_speed)
           //console.log(x)
          ctx.closePath();
          ctx.fill();
    
            requestAnimationFrame(render);
          console.log("END-->")
            if (theroom.set.ball.x >= 700 && is_emited == 0)
            {
            //  console.log("emit " + theroom.set.ball.x)
              is_emited = 1;
              StartGame(theroom.room_name)
              //theroom.set.ball.x = 0;
            }
/*             else if (theroom.set.ball.x < 0){
              StartGame(theroom.room_name)
            } */

          }
          console.log("11111")
        };
        console.log("22222")
        render();
      
        console.log("33333")

      });
      console.log("44444")

    }, [socket]);
    console.log("----")

  ///////////////////////////////INGAME

  /////////////////////////////////////
  if (nbrconnect == 2 && isinroom && opready == true && imready == true) {
    return (
      <div className="readyGame">
        <h1 style={{ color: "blue" }}> you are : {my_id} </h1>
         <h2 style={{ color: "red" }}> opponent is : {op_id} </h2>
        <button onClick={deleteGameRoom}>leave room {room}</button>
{/* //////////////// */}
        {/* {start_timer()} */}
         <p>time played =</p>
        <p>zzzz = </p>
       {/*  <p>{mytimer.toString()}</p> 
        <p>{timecount.toString()}</p> */} 
        <canvas
        id="canvas"
        height="500px"
        width="800px"
        style={{ backgroundColor: '#4E4E4E' }}
        >

        </canvas>
{/* //////////////// */}

      </div>
    );
  } else if (nbrconnect == 2 && isinroom) {
    return (
      <div className="readytoplay">
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


{/*         <canvas
        id="canvas"
        height="500px"
        width="800px"
        style={{ backgroundColor: '#4E4E4E' }}
        >

        </canvas> */}

      </div>
    );
  }
}