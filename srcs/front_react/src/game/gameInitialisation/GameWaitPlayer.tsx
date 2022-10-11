import { useEffect, useState } from "react";
import { socket } from "../Game";
import img_map1 from "../../assets/game_assets/map1.png";
import img_map2 from "../../assets/game_assets/map2.png";
import img_map3 from "../../assets/game_assets/map3.png";
import img_power1 from "../../assets/game_assets/power1.png";
import img_power2 from "../../assets/game_assets/power2.png";
import img_power3 from "../../assets/game_assets/power3.png";
import "./init.css"
export function GameWaitPlayerReady(props: any) {
  const [color_ready, setColor_ready] = useState("");
  const [im_ready, setim_ready] = useState(false);

  const [map1, setmap1] = useState("5px solid green");
  const [map2, setmap2] = useState("5px solid white");
  const [map3, setmap3] = useState("5px solid white");

  const [power1, setpower1] = useState("5px solid white");
  const [power2, setpower2] = useState("5px solid white");
  const [power3, setpower3] = useState("5px solid white");

  const [witchmap, setwitchmap] = useState(1);
  const [wichpower, setwichpower] = useState(0);
  // tableau de string withc power 
  
  // Set both players ready before game start

  function ReadyGame() {
    if (im_ready === false) {
      var data = {
        room: props.room,
        map: witchmap,
        power: wichpower,
      };
      setColor_ready("green");
      setim_ready(true);
      socket.emit("readyGameRoom", props.room);
      console.log("witchmap = ", witchmap);
      console.log("wichpower = ", wichpower);
      if (props.im_right === false)
        socket.emit("readyGameMapPower", data);
    }
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
      setmap1("5px solid white");
      setmap2("5px solid white");
      setmap3("5px solid white");
      if (map === 1) {
        setmap1("5px solid green");
        setwitchmap(1);
      }
      if (map === 2) {
        setmap2("5px solid green");
        setwitchmap(2);
      }
      if (map === 3) {
        setmap3("5px solid green");
        setwitchmap(3);
      }
    }
  }

  function select_power(power: number) {
    if (color_ready === "") {
      //setpower("5px solid white");
     // setpower2("5px solid white");
     // setpower3("5px solid white");
      
      if (power === 1 && power1 === "5px solid green") {
        setpower1("5px solid white");
        setwichpower(wichpower - 1);
      }
      else if (power === 1) {
        setpower1("5px solid green");
        setwichpower(wichpower + 1);
      }
      if (power === 2 && power2 === "5px solid green") {
        setpower2("5px solid white");
        setwichpower(wichpower - 2);

      }
      else if (power === 2) {
        setpower2("5px solid green");
        setwichpower(wichpower + 2);
      }
      if (power === 3 && power3 === "5px solid green") {
        setpower3("5px solid white");
        setwichpower(wichpower - 4);
      }
      else if (power === 3) {
        setpower3("5px solid green");
        setwichpower(wichpower + 4);
      }
    }
  }

  function display_power(power: number) {
    if (power === 1) {
      return (
        <div className="power">
          <img src={img_power1} style={{border:power1}} alt="power1" />
        </div>
      );
    }
    else if (power === 2) {
      return (
        <div className="power">
          <img src={img_power2} style={{border:power2}} alt="power2" />
        </div>
      );
    }
    else if (power === 3) {
      return (
        <div className="power">
          <img src={img_power1} style={{border:power3}} alt="power3" />
          <img src={img_power2} style={{border:power3}} alt="power3" />

        </div>
      );
    }
    else if (power === 4) {
      return (
        <div className="power">
          <img src={img_power3} style={{border:power3}} alt="power3" />

        </div>
      );
    }
    else if (power === 5) {
      return (
        <div className="power">
          <img src={img_power1} style={{border:power3}} alt="power3" />
          <img src={img_power3} style={{border:power3}} alt="power3" />

        </div>
      );
    }
    else if (power === 6) {
      return (
        <div className="power">
          <img src={img_power2} style={{border:power3}} alt="power3" />
          <img src={img_power3} style={{border:power3}} alt="power3" />

        </div>
      );
    }
    else if (power === 7) {
      return (
        <div className="power">
          <img src={img_power1} style={{border:power3}} alt="power3" />
          <img src={img_power2} style={{border:power3}} alt="power3" />
          <img src={img_power3} style={{border:power3}} alt="power3" />

        </div>
      );
    }
    else {
      return (
        <div className="power">
          <h3> : no power</h3>
        </div>
      );
    }
  }

  function display_map(map: number) {
    if (map === 1) {
      return (
        <div className="map">
          <img src={img_map1} style={{border:map1}} alt="map1" />
        </div>
      );
    }
    if (map === 2) {
      return (
        <div className="map">
          <img src={img_map2} style={{border:map2}} alt="map2" />
        </div>
      );
    }
    if (map === 3) {
      return (
        <div className="map">
          <img src={img_map3} style={{border:map3}} alt="map3" />
        </div>
      );
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
          <h1>{wichpower}</h1> 
      <h2> Select map </h2>

      <input onClick={() => select_map(1)} style={{border:map1}} type="image" id="image" alt="Login" src={img_map1}></input>
      <input onClick={() => select_map(2)} style={{border:map2}} type="image" id="image" alt="Login" src={img_map2}></input>
      <input onClick={() => select_map(3)} style={{border:map3}} type="image" id="image" alt="Login" src={img_map3}></input>

      <h2> Select power </h2>

      <input onClick={() => select_power(1)} style={{border:power1}} type="image" id="image" alt="Login" src={img_power1}></input>
      <input onClick={() => select_power(2)} style={{border:power2}} type="image" id="image" alt="Login" src={img_power2}></input>
      <input onClick={() => select_power(3)} style={{border:power3}} type="image" id="image" alt="Login" src={img_power3}></input>
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

        <h1> MAP IS {display_map(witchmap)}</h1>
        <h1> POWER IS {display_power(wichpower)}</h1>
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
