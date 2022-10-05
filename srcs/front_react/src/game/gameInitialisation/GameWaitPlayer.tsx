import { useEffect, useState } from "react";
import { socket } from "../Game";
import img_map2 from "../../assets/game_assets/map1.png";
//import map2 from "../../assets/game_assets/map2.png";
//import map3 from "../../assets/game_assets/map3.png";
import "./init.css"
export function GameWaitPlayerReady(props: any) {
  const [color_ready, setColor_ready] = useState("");

  const [map, setmap] = useState("5px solid green");
  const [map2, setmap2] = useState("5px solid white");
  const [map3, setmap3] = useState("5px solid white");

  const [power, setpower] = useState("5px solid green");
  const [power2, setpower2] = useState("5px solid white");
  const [power3, setpower3] = useState("5px solid white");

  const [witchmap, setwitchmap] = useState(-1);
  const [wichpower, setwichpower] = useState(-1);

  // Set both players ready before game start

  function ReadyGame() {

    var data = {
      room: props.room,
      map: witchmap,
      power: wichpower,
    };
    setColor_ready("green");
    socket.emit("readyGameRoom", props.room);
    console.log("witchmap = ", witchmap);
    console.log("wichpower = ", wichpower);
    if (props.im_right === false)
      socket.emit("readyGameMapPower", data);
  }

  useEffect(() => {
    socket.on("Get_map_power", (data: any) => {
      setColor_ready("green");
      setwitchmap(data.map);
      setwichpower(data.power);
    });
  }, [wichpower, witchmap, color_ready]);

  // Set map and power before game start by player 1 who created the room

  function select_map(map: number) {
  
    if (color_ready === "") {
      setmap("5px solid white");
      setmap2("5px solid white");
      setmap3("5px solid white");
      if (map === 0) {
        setmap("5px solid green");
        setwitchmap(0);
      }
      if (map === 1) {
        setmap2("5px solid green");
        setwitchmap(1);
      }
      if (map === 2) {
        setmap3("5px solid green");
        setwitchmap(2);
      }
    }
  }

  function select_power(power: number) {
    if (color_ready === "") {
      setpower("5px solid white");
      setpower2("5px solid white");
      setpower3("5px solid white");
      if (power === 0) {
        setpower("5px solid green");
        setwichpower(0);
      }
      if (power === 1) {
        setpower2("5px solid green");
        setwichpower(1);
      }
      if (power === 2) {
        setpower3("5px solid green");
        setwichpower(2);
      }
    }
  }

  if (props.im_right === false) {
  return (
    <div className="readytoplay">
      <h2> you are : {props.my_id} </h2>
      <p> THE ROOM "{props.room}" IS READY TO PLAY </p>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>

      <b>
        {props.opready ? (
          <h2 style={{ color: "green" }}> opponent {props.op_id} is ready </h2>
        ) : (
          <h2> waiting for : {props.op_id} </h2>
        )}
      </b>

      <h2> Select map </h2>

      <input onClick={() => select_map(0)} style={{border:map}} type="image" id="image" alt="Login" src={img_map2}></input>
      <input onClick={() => select_map(1)} style={{border:map2}} type="image" id="image" alt="Login" src={img_map2}></input>
      <input onClick={() => select_map(2)} style={{border:map3}} type="image" id="image" alt="Login" src={img_map2}></input>

      <h2> Select power </h2>

      <input onClick={() => select_power(0)} style={{border:power}} type="image" id="image" alt="Login" src={img_map2}></input>
      <input onClick={() => select_power(1)} style={{border:power2}} type="image" id="image" alt="Login" src={img_map2}></input>
      <input onClick={() => select_power(2)} style={{border:power3}} type="image" id="image" alt="Login" src={img_map2}></input>
    <br />
    <button style={{ color: color_ready }} onClick={ReadyGame}>
      {" "}
      READY ?
    </button>
    </div>
  );
  } else if (color_ready === "green") {
    return (
      <div className="readytoplay">
        <h2> you are : {props.my_id} </h2>
        <p> THE ROOM "{props.room}" IS READY TO PLAY </p>
        <button onClick={props.deleteGameRoom}>leave GAME</button>
        <button style={{ color: color_ready }} onClick={ReadyGame}>
          {" "}
          READY ? {props.room}
        </button>
  
        <b>
          {props.opready ? (
            <h2 style={{ color: "green" }}> opponent {props.op_id} is ready </h2>
          ) : (
            <h2> waiting for : {props.op_id} </h2>
          )}
        </b>

        <h1> POWER IS {wichpower}</h1>
        <h1> MAP IS {witchmap}</h1>
      </div>
    );
  } else {
    return (
      <div className="readytoplay">
        <h2> you are : {props.my_id} </h2>
        <p> THE ROOM "{props.room}" IS READY TO PLAY </p>
        <button onClick={props.deleteGameRoom}>leave GAME</button>
        <b>
          {props.opready ? (
            <h2 style={{ color: "green" }}> opponent {props.op_id} is ready </h2>
          ) : (
            <h2> waiting for : {props.op_id} </h2>
          )}
        </b>
      </div>
    );
  }
}
