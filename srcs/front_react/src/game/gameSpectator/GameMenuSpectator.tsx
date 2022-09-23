import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { threadId } from "worker_threads";
import { api } from "../../userlist/UserListItem";
import {
  ballObj,
  socket,
} from "../Game";
import Display_game from "./display_game";
////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////

let x = 0;
export function GameMenuSpectator(props: any) {
  
  //let [listGame, setlistGame] = useState<string[]>(props.listGame);
  const [listGame, setlistGame] = useState<string[]>([]);
  const [listGamenotz, setlistGamenotz] = useState(false);
  const [g, setg] = useState(true);
  const [game_already_ended, setgame_already_ended] = useState("");

  useEffect(() => {
    socket.on("GameSpecEmpty", () => {
      setg(true);
      setgame_already_ended("game already ended");
      props.store.setisLookingRoom(true);
      props.store.setSpecthegame(false);
      console.log("ended")
    });

/*     socket.on("change_status", () => {
      setlistGamenotz(false);
      props.store.setisLookingRoom(false);
      props.store.setSpecthegame(true);
    }); */

  }, [socket]);

/*   function Specthegamedisplayfunc(room : string) {
    console.log("||||||||Specthegamedisplayfunc room [", room, "]");
    setlistGamenotz(false);
    props.store.setisLookingRoom(false);
    props.store.setSpecthegame(true);
    socket.emit("Specthegame", room);
  }
 */

  // Fonction qui gere le bouton pour quitter le mode spectateur

  const Specthegamedisplay = (event : any, param : any) => {
    //console.log(param);

    api.get("/game/game_to_spec").then((res) => {
      console.log(res.data);
    for (const [key, value] of Object.entries(res.data)) {
          let obj: any = value;
          if (obj)
            console.log("room_name = ", obj.room_name);
          if (obj && obj.room_name == param)
          {
            console.log("\n\n||||||||Specthegamedisplayfunc room [", param, "]");
            setlistGamenotz(false);
            props.store.setisLookingRoom(false);
            props.store.setSpecthegame(true);
            props.store.setRoom_name_spec(obj.room_name);

            //socket.emit("Specthegame", param);
          }
        }
      
    }).catch((res) => {
      console.log("invalid jwt");
      console.log(res);
    });
    if (props.store.Specthegame === false)
    {
      console.log("game already ended");
      setgame_already_ended("game already ended");
    }
    //props.store.setSpecthegame(true);
  };

  function leavelookingroom() {

    socket.emit("LeaveAllGameRoom", "lookroom");
    listGame.splice(0, listGame.length);
    props.store.setisLookingRoom(false);

  }

  
  async function get_all_game_room_api() {
    await api.get("/game/game_to_spec").then((res) => {
      console.log(res.data);
      //setlistGame(res.data);//

      //console.log("res.data = ", res.data. , "\nvalue = ", res.data.room_name);
      let donot = false;
      let key2;
      for (const [key, value] of Object.entries(res.data)) {
          //console.log("key = ", key, "\nvalue = ", value);
          let obj: any = value;
          if (obj)
            console.log("room_name = ", obj.room_name);
          //console.log(listGame.length);
          for (let i = 0;
          i <listGame.length && donot === false; i++) {
            key2 =  listGame[i];
            if (key === key2 || obj.game_started === false) {
              donot = true;
            }
          }
          console.log("obj.game_started = ", obj.game_started);
          if (donot === false && obj.game_started === true) {
            console.log("obj = ", obj);
            listGame.push(obj.room_name);
          } else {
            donot = false;
          }
        
        }
        for (let i = 0; i <  listGame.length; i++) {
          console.log(i + " === " +  listGame[i]);
       }
       if (listGame.length !== 0) {
        setlistGamenotz(true);
      }


    }).catch((res) => {
      console.log("invalid jwt");
      console.log(res);
    });
  }


    function  refresh_games_spec_solo() {
      setlistGamenotz(false);
      listGame.splice(0, listGame.length);
      get_all_game_room_api();
    }
    function  refresh_games_spec() {
        setgame_already_ended("");
        refresh_games_spec_solo()
      }
  
      if (g === true) {
        refresh_games_spec_solo();
        setg(false);
      }
    if (listGamenotz === true) {
      return (
          <div className="look">
            <h4> REGARDER une partie : </h4>
            <h4 style={{color: "red"}}>{game_already_ended}</h4>

            <button onClick={refresh_games_spec}>refresh</button>
            <p> wich game do you want to look at ?</p>
            {listGame.map((element: any, index: any) => {
              return (
                <div key={index}>
                  <p>
                    partie : "{element}"{" "}
                    <button onClick={event => Specthegamedisplay(event, element)}>
                    regarder la partie
                    </button>
                  </p>
                </div>
              );
            })}
            <button onClick={leavelookingroom}>leave</button>
          </div>
      );
    } else {
      return (
        <div className="look">
          <h4> REGARDER no game wet : </h4>
          <h4 style={{color: "red"}}>{game_already_ended}</h4>

          <button onClick={refresh_games_spec}>refresh</button>
          <br />
          <br />
          <button onClick={leavelookingroom}>leave</button>
        </div>
      );
    }
}

////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////