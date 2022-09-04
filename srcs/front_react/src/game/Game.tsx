import React, { useEffect, useRef, useState } from "react";
import "./Game.css";
import io from "socket.io-client";
import { start } from "repl";
import { render } from "@testing-library/react";
import FtClock from "./Clock";
import InGame from "./inGame";
import { BallMouv, BallCol_right, BallCol_left, PaddleMouv_left, PaddleMouv_right, draw_line, draw_score } from "./BallMouv";
import data from './BallMouv';
import { syncBuiltinESMExports } from "module";
import { hasSelectionSupport, wait } from "@testing-library/user-event/dist/utils";
import { resolve } from "path";

const socket = io("http://localhost:4000/game");

socket.on("connect_error", (err) => {
  console.log(`|||||||||||connect_error due to ${err.message}`);
  
});


/* function Theclock(){
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
} */

export default function Game() {
  const [nbrconnect, setnbrconnect] = useState(0);
  const [room, setRoom] = useState("");
  const [lookingroom, setLookingRoom] = useState("");

  const [color_ready, setColor_ready] = useState("");
  const [my_id, setmy_id] = useState(socket.id);
  const [op_id, setop_id] = useState("2");
  const [im_right, setim_right] = useState(false);
  
  const [islookingroom, setisLookingRoom] = useState(false);

  const [isfull, setisFull] = useState("");
  const [isinroom, setisinroom] = useState(false);

  const [imready, setimready] = useState(false);
  const [opready, setopready] = useState(false);
  const [PP_empty, setPP_empty] = useState("");
  const [gameover, setgameover] = useState(false);

  const [gamestart, setgamestart] = useState(false);

  const [listGame, setListGame] = useState<string[]>([]);


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

  function lookthegame() {
    //setisLookingRoom(false);


    console.log("lookthegamelookthegamelookthegamelookthegamelookthegame lookthegame");
    //console.log(listGame)


    console.log("/*/**//*/**/   " + lookingroom)
    socket.emit("lookGameRoom", lookingroom);
    
  }

  function lookAtAllGameRoom() {
    setisLookingRoom(true);

    console.log("LOOKNIGRROM LOG");
    //console.log(listGame)



    socket.emit("lookAllGameRoom", "lookroom");
  }


  function reinit_game() {
/*     player_left.name = "null";
    player_left.score = 0;
    player_left.won = false;

    player_right.name = "null";
    player_right.score = 0;
    player_right.won = false; */

/*     ballObj.ingame_dx = ballObj.init_dx;
    ballObj.ingame_dy = ballObj.init_dy;
    
    ballObj.x = ballObj.init_x;
    ballObj.y = ballObj.init_y;

    ballObj.first_dx = ballObj.init_first_dx;
    ballObj.first_dy = ballObj.init_first_dy;  */
  
    ballObj.init_ball_pos = false;
    ballObj.first_col = false;

  }

/*   var str = '<ul>'

  listGame.forEach(function(listGame) {
    str += '<li>'+ listGame + '</li>';
  }); 

  str += '</ul>';
  document.getElementById("lookGamediv").innerHTML = str;
 */

  function deleteGameRoom() {
    if (isinroom == true) {
      setisinroom(false);
      setgameover(true);
      setgamestart(false);
      
      reinit_game();

      setColor_ready("black");
      socket.emit("leaveGameRoom", room);
      //console.log(`--front--User leave room [${room}]`);
      setRoom("");
    }
  }

  
  function leavelookingroom() {
      setisLookingRoom(false);
      setLookingRoom("");
      console.log("list when living '" + listGame);
      setListGame([]);
      console.log("list when living then '" + listGame);
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



/*       setListGame(prevlistgame => [...prevlistgame,
      , theroom.room_name,]); */

      //setListGame(listGame.set(theroom.room_name, theroom.room_name) );
      //setListGame(prev => new Map([...prev, [theroom.room_name, theroom.room_name]]))
/*         

      listGame.forEach((value: string, key: string)  => {
        console.log("joined room value = " + value, " key = " + key);
      }) 
      console.log("APRES JOINED"); */
      
      //console.log("p1 = " + theroom.p1);
      //console.log("p2 = " + theroom.p2);
      //console.log("socker id = " + theroom.p2);

      if (theroom.p2 == socket.id)
      {
        setop_id(theroom.p1);
        setim_right(true);
      }
      else if (theroom.p1 == socket.id)
      {
        setop_id(theroom.p2);
        setim_right(false);
      }
       // console.log(
       // "recu le msg from back de : " + theroom.nbr_co + " == " + nbrconnect);
    });
    
    socket.on("getAllGameRoom", (theroom: Map<any, any>) => {
      console.log ("getAllGameRoom watch client side");

      console.log("1 socker");

    for (const [key, value] of Object.entries(theroom)) {

      console.log("rooma are : [" + key + "][" + "]");
      //setListGame(prevNames => [...prevNames, key]); ERROR HERE
    } 

    console.log("2 socket");


    });

    socket.on("leftRoom", (theroom) => {
      setnbrconnect(theroom.nbr_co);
      setopready(false);
      setimready(false);
      setop_id("");

      if (theroom.set.set_p1 && theroom.set.set_p2) {
        player_left.name = theroom.set.set_p1.name;
        player_left.score = theroom.set.set_p1.score;
        player_left.won = theroom.set.set_p1.won;
    
        player_right.name = theroom.set.set_p1.name;
        player_right.score = theroom.set.set_p1.score;
        player_right.won = theroom.set.set_p1.won;
      }
    });

    socket.on("leftRoomEmpty", () => {
      setnbrconnect(0);
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

  useEffect(() => {
    socket.on("sincTheBall", (theroom) => {
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
    socket.on("mouvPaddleLeft", (theroom) => {
      paddleProps_left.x = theroom.set.p1_padle_obj.x;
      paddleProps_left.y = theroom.set.p1_padle_obj.y;
    }); 
    socket.on("mouvPaddleRight", (theroom) => {
      paddleProps_right.x = theroom.set.p2_padle_obj.x;
      paddleProps_right.y = theroom.set.p2_padle_obj.y;
    }); 
    socket.on("setPlayerLeft", (theroom) => {
      player_left.score = theroom.set.set_p1.score;
      player_left.won = theroom.set.set_p1.won;
      player_left.name = theroom.set.set_p1.name;
    }); 
    socket.on("setPlayerRight", (theroom) => {
      player_right.score = theroom.set.set_p2.score;
      player_right.won = theroom.set.set_p2.won;
      player_right.name = theroom.set.set_p2.name;
  }); 

  }, [socket]);




  function sinc_ball(room_name : string, objball: any){
   /*  console.log (" !!!!! BEFORE sinc ball  ===!!!!");
    console.log (nbrconnect)
    console.log (isinroom)
    console.log (opready)
    console.log (imready)
    console.log (player_left.won)
    console.log (player_right.won)
    console.log (" !!!!! BEFORE sinc ball  ===!!!!");
 */
    //console.log("BEFORE SINC ROOM NAME = " + room_name)
    if (/* nbrconnect == 2 && isinroom && opready == true && imready == true
      && */ player_left.won == false && player_right.won == false ) {
      var data={  
        room : room_name,
        ball : objball,
      };
      
      console.log (" !!!!! sinc ball  EMIT in  sincBall===!!!!");
      socket.emit("sincBall", data);
     // sendPaddleMouvLeft(paddleProps_left, room);
    }
  }

  function mouv_paddle_left(e: any){
    if (nbrconnect == 2 && isinroom && opready == true && imready == true && im_right == false &&
      player_left.won == false && player_right.won == false) {
      (paddleProps_left.y = e.clientY  - (paddleProps_left.width / 2) - 15 );
      var data={  
        room : room,
        pd : paddleProps_left,
      };
    
      //console.log (" !!!!! EMIT IN LEFT ===!!!![" + room_name +"]");
      socket.emit("paddleMouvLeft", data);
     // sendPaddleMouvLeft(paddleProps_left, room);
    }
  }

  function mouv_paddle_right(e: any){
    if (nbrconnect == 2 && isinroom && opready == true && imready == true && im_right == true &&
      player_left.won == false && player_right.won == false) {
      (paddleProps_right.y = e.clientY  - (paddleProps_right.width / 2) - 15 );
      var data={  
        room : room,
        pd : paddleProps_right,
      };
    
      //console.log (" !!!!! EMIT IN LEFT ===!!!![" + room_name +"]");
      socket.emit("paddleMouvRight", data);
      //sendPaddleMouvRight(paddleProps_right, room);
    }
  }
  
/*   function     sendPaddleMouvLeft(paddle: object, room_name: string) {
    
  }
  function sendPaddleMouvRight(paddle: object, room_name: string) {
    
  }



  function sendPlayerInfoLeft(player: object, room_name: string) {
    var data={  
      room : room_name,
      p : player,  
    };

    console.log (" sendPlayerInfoLeft [" + room_name +"]");
    socket.emit("playerActyLeft", data);
    
  }

  function     sendPlayerInfoRight(player: object, room_name: string) {
    
    var data={  
      room : room_name,
      p : player,  
    };

    console.log ("sendPlayerInfoRight=!!!![" + room_name +"]");
    socket.emit("playerActyRight", data);
  } */
  
    const [ball_speed, setball_speed] = useState(0);
  const [ball_color, setball_color] = useState("blue");

  let x = 0;
  let speed = 10;
  let color = "blue"
  let is_emited = 0;
  console.log("ici ");
  const canvasRef = useRef(null);
  let u = 0;
  useEffect(() => {
      socket.on("startGame", (theroom) => {
        //console.log("im right ? = " + im_right);
        player_left.name = theroom.set.set_p1.name;
        player_right.name = theroom.set.set_p2.name;
        sinc_ball(theroom.room_name, ballObj)

        console.log("SINC FIRST");
  
        const render = () => {
       // console.log("ici 2 ");

          const canvas: any = canvasRef.current;
          //const canvas = document.getElementById('canvas') as HTMLCanvasElement;
          var ctx = null;
          if (canvas)
          ctx = canvas.getContext('2d');


      
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (player_left.won == false && player_right.won == false)
            {
              draw_line(ctx, ballObj, canvas.height, canvas.width)
              draw_score(ctx, player_left, player_right,canvas.height, canvas.width)

              BallMouv(ctx, ballObj, canvas.height, canvas.width)

              BallCol_left(ctx, player_right,ballObj, paddleProps_left, canvas.height, canvas.width)
              if (ballObj.is_col == true)
                u = 1;
              BallCol_right(ctx, player_left,ballObj, paddleProps_right, canvas.height, canvas.width)
              if (ballObj.is_col == true || ballObj.init_ball_pos == false)
                u = 1;              
              if (u > 0)
                u++;
              if (u == 6) {
                sinc_ball(theroom.room_name, ballObj)
                u = 0;
              }
    
              PaddleMouv_left(ctx, canvas, paddleProps_left);
              PaddleMouv_right(ctx, canvas, paddleProps_right);

              //SendPaddleMouv(paddleProps_left, paddleProps_right, theroom.room_name);
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
        onMouseMove={(e) => mouv_paddle_right(e)}
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
        onMouseMove={(e) => mouv_paddle_left(e)}
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
  } else if (islookingroom == true) {

    return (
      <div className="look"> 

        <h4> REGARDER une partie : </h4>
        <p> wich game do you want to look at ?</p>
        {listGame.map((element, index) => {
        setLookingRoom(element)
        return (
          <div key={index}>
            <p>partie : "{element}" <button onClick={lookthegame}>regarder la partie</button>
            </p>
          </div>
        );
        })}
      <button onClick={leavelookingroom}>leave</button>
      </div>
    );
  }


  else {
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

        <h4> REGARDER une partie :
        <button onClick={lookAtAllGameRoom}>regarder la partie</button> </h4>


{/*       <p> La partie dans la room :  "{listGame}"" + "{listGame[0]}" + "{listGame[1]}" + "{listGame[2]}"
        <button onClick={createFastGameRoom}>regarder la partie</button>
        </p>
        
        {listGame.map((element, index) => {
        return (
          <div key={index}>
            <p>partie : "{element}" <button onClick={createFastGameRoom}>regarder la partie</button>
            </p>
          </div>
        );
        })} */}

       {/* <div id="lookGamediv"></div> */}
 


      </div>
    );
  }
}