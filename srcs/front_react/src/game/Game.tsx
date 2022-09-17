import React, {
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Game.css";
import io from "socket.io-client";
import data from "./gameReact/data";
import { GamePlayer_Left_right} from "./gameReact/GameReact";
import { GameSpectator } from "./gameSpectator/GameSpectator";
import GameMenu from "./gameInitialisation/GameMenu";
import { GameWaitPlayerReady } from "./gameInitialisation/GameWaitPlayer";
import { GamePlayer_left } from "./gameReact/GamePlayerLeft";
import { GamePlayer_right } from "./gameReact/GamePlayerRight";
import GameCreationSettings from "./gameInitialisation/GameCreationSettings";
import { GameMenuSpectator } from "./gameSpectator/GameMenuSpectator";

export const socket = io("http://localhost:4000/game");

socket.on("connect_error", (err) => {
  console.log(`|||||||||||connect_error due to ${err.message}`);
});

export let {
  ballObj,
  player_left,
  player_right,
  paddleProps_left,
  paddleProps_right,
} = data;
let x = 0;

export default function Game() {
  const [nbrconnect, setnbrconnect] = useState(0);
  const [room, setRoom] = useState("");
 // const [lookingroom, setLookingRoom] = useState("");
  const [color_ready, setColor_ready] = useState("");
  const [my_id, setmy_id] = useState(socket.id);
  const [op_id, setop_id] = useState("2");
  const [im_right, setim_right] = useState(false);
  const [islookingroom, setisLookingRoom] = useState(false);
  //const [Specthegame, setSpecthegame] = useState(false);
  const [isfull, setisFull] = useState("");
  const [isinroom, setisinroom] = useState(false);
  const [imready, setimready] = useState(false);
  const [opready, setopready] = useState(false);
  const [PP_empty, setPP_empty] = useState("");
  const [gameover, setgameover] = useState(false);
  const [gamestart, setgamestart] = useState(false);
  const [listGame, setListGame] = useState<string[]>([]);
  const [Specthegame, setSpecthegame] = useState(false);



  const store = {
    nbrconnect: nbrconnect,
    room: room,
    //lookingroom: lookingroom,
    color_ready: color_ready,
    my_id: my_id,
    op_id: op_id,
    im_right: im_right,
    islookingroom: islookingroom,
    //Specthegame: Specthegame,

    isfull: isfull,
    isinroom: isinroom,
    imready: imready,
    opready: opready,
    PP_empty: PP_empty,
    gameover: gameover,
    gamestart: gamestart,
    listGame: listGame,
    Specthegame: Specthegame,


    setSpecthegame: setSpecthegame,

    setnbrconnect: setnbrconnect,
    setRoom: setRoom,
    //setLookingRoom: setLookingRoom,
    setColor_ready: setColor_ready,
    setmy_id: setmy_id,
    setop_id: setop_id,
    setim_right: setim_right,
    setisLookingRoom: setisLookingRoom,
    //setSpecthegame: setSpecthegame,
    setisFull: setisFull,
    setisinroom: setisinroom,
    setimready: setimready,
    setopready: setopready,
    setPP_empty: setPP_empty,
    setgameover: setgameover,
    setgamestart: setgamestart,
    setListGame: setListGame,
  };

  ////////////////////////////////////////////////////
  // DELETE / LEAVE ROOM
  ////////////////////////////////////////////////////

    // function who move the ball



  useEffect(() => {

    
    
    ////////////////////////////////////////////////////
    // LOOKING ROOM
    ////////////////////////////////////////////////////
    socket.on("LeaveAllGameRoom", (theroom: Map<any, any>) => {
      setisLookingRoom(false);
      console.log("listGame = " + listGame);
      console.log("propslistGame = " + store.listGame);
  
      listGame.splice(0, listGame.length);

      console.log("------------------");

      console.log("listGame = " + listGame);
      console.log("propslistGame = " + store.listGame);


    });

    socket.on("getAllGameRoom", (theroom: Map<any, any>) => {
      // listGame = [];
      console.log("------------------");
      x++;
      console.log("x = " + x);
      console.log("1 socker");
      let donot = false;
      let key2;
      for (const [key, value] of Object.entries(theroom)) {
        //console.log("first[" + key + "]");
        // setListGame(key);
        //setNames(prevNames => [...prevNames, 'Bob'])}
        // setListGame((prevNames: any) => [...prevNames, key]);
        // listGame.

          console.log( listGame.length);
          for (let i = 0; i <  listGame.length; i++) {
            key2 =  listGame[i];
            //console.log("-[" + key2 + "][" + key + "]");
            //console.log( listGame[i]);
            if (key === key2) {
              donot = true;
            }
          }

          if (donot === false) {
            // setListGame((prevNames: any) => [...prevNames, key]);
             listGame.push(key);
          } else {
            donot = false;
          }
        
        }
        
        for (let i = 0; i <  listGame.length; i++) {
          key2 =  listGame[i];
          //console.log("-[" + key2 + "][" + key + "]");
          console.log("all list = " +  listGame[i]);

        }
        //store.listGame = listGame;
        setisLookingRoom(true);
    });
    ////////////////////////////////////////////////////
    // LOOKING ROOM
    ////////////////////////////////////////////////////

    socket.on("leftRoom", (theroom: any) => {
      setnbrconnect(theroom.nbr_co);
      setopready(false);
      setimready(false);
      setgamestart(false);
      setop_id("");
      console.log("leftRoom");

      player_left.name = "empty";
      player_left.score = 0;
      player_left.won = false;

      player_right.name = "empty";
      player_right.score = 0;
      player_right.won = false;

      ballObj.init_ball_pos = false;
      ballObj.first_col = false; 
      
    });
    
    socket.on("leftRoomEmpty", () => {
      setnbrconnect(0);
      setopready(false);
      setimready(false);
      setgamestart(false);
      setisinroom(false);
      setop_id("");
      player_left.name = "empty";
      player_left.score = 0;
      player_left.won = false;

      player_right.name = "empty";
      player_right.score = 0;
      player_right.won = false;

      ballObj.init_ball_pos = false;
      ballObj.first_col = false; 
    });

    setisFull("");
    setmy_id(socket.id);
    
    socket.on("roomFull", (theroom: any) => {
      setisFull("This ROOM IS FULL MATE");
      console.log("THIS ROOM IS FULL");
    });
  }, [socket]);

  function deleteGameRoom() {
    console.log("deleteGameRoom FROOOONNNNT");
    //ancelAnimationFrame(requestAnimationFrameId);

    if (isinroom === true) {
      setisinroom(false);
      setgameover(true);
      setgamestart(false);
      setimready(false);
      setopready(false);
      setim_right(false);
      
      ballObj.init_ball_pos = false;
      ballObj.first_col = false;
      setColor_ready("black");
      socket.emit("leaveGameRoom", room);
      setRoom("");
    }
  }

  ////////////////////////////////////////////////////
  //// REACT GAME
  ////////////////////////////////////////////////////

  //const canvasRef2 = useRef(null);
/*   const canvasRef = useRef(null);
  if (gamestart === true) {
    The_whole_game(canvasRef);
  } */

  let canvasRef = createRef();

  ////////////////////////////////////////////////////

  if (gamestart === true) {
    return <GamePlayer_Left_right store={store}  canvasRef={canvasRef} deleteGameRoom={deleteGameRoom}/>
  } else if (nbrconnect === 2 && isinroom) {
    return (
      <GameWaitPlayerReady
        my_id={my_id}
        room={room}
        deleteGameRoom={deleteGameRoom}
        setColor_ready={setColor_ready}
        color_ready={color_ready}
        opready={opready}
        op_id={op_id}
      />
    );
  } else if (isinroom === true) {
    return (
      <GameCreationSettings my_id={my_id} room={room} deleteGameRoom={deleteGameRoom} />
    );
  } else if (islookingroom === true)
    return <GameMenuSpectator store={store} listGame={listGame}/*  canvasRef={canvasRef} */ />;
  else if (Specthegame === true)
    return <GameSpectator store={store} listGame={listGame}  canvasRef={canvasRef}  />
  else {
    return <GameMenu store={store} />;
  }
}
