import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { threadId } from "worker_threads";
import { api } from "../../userlist/UserListItem";
import {
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

  function Specthegamedisplayfunc(room : string) {
      setlistGamenotz(false);
      props.store.setisLookingRoom(false);
      
      props.store.setSpecthegame(true);
      socket.emit("Specthegame", room);
    }

  // Fonction qui gere le bouton pour quitter le mode spectateur

  const Specthegamedisplay = (event : any, param : any) => {
    console.log(param);
    //props.store.setSpecthegame(true);
    Specthegamedisplayfunc(param);
  };

  function leavelookingroom() {

    socket.emit("LeaveAllGameRoom", "lookroom");
    listGame.splice(0, listGame.length);
    props.store.setisLookingRoom(false);

  }

  
  async function get_all_game_room_api() {
    await api.get("/game/game_to_spec").then((res) => {
      console.log(res.data);
      //setlistGame(res.data);

      //console.log("res.data = ", res.data. , "\nvalue = ", res.data.room_name);
      let donot = false;
      let key2;
      for (const [key, value] of Object.entries(res.data)) {
          //console.log("key = ", key, "\nvalue = ", value);
          let obj: any = value;
          if (obj)
            console.log("room_name = ", obj.room_name);
          //console.log(listGame.length);
          for (let i = 0; i <  listGame.length; i++) {
            key2 =  listGame[i];;
            if (key === key2) {
              donot = true;
            }
          }

          if (donot === false) {
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


  function  refresh_games_spec() {
      setlistGamenotz(false);

      listGame.splice(0, listGame.length);
      get_all_game_room_api();
      //socket.emit("lookAllGameRoom", "lookroom");
    }

    if (g === true) {
      refresh_games_spec();
      setg(false);
    }


    if (listGamenotz === true) {
      return (
          <div className="look">
            <h4> REGARDER une partie : </h4>
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