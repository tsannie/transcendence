import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { threadId } from "worker_threads";
import {
  socket,
} from "../Game";
////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////

let x = 0;

export function GameMenuSpectator(props: any) {

  function Specthegamedisplayfunc(room : string) {
      props.store.setSpecthegame(true);
      props.store.setisLookingRoom(false);
      socket.emit("Specthegame", room);
    }

  // Fonction qui gere le bouton pour quitter le mode spectateur

  const Specthegamedisplay = (event : any, param : any) => {
    console.log(param);
    Specthegamedisplayfunc(param);
  };

  function leavelookingroom() {
    //props.store.setisLookingRoom(false);
    //props.store.setLookingRoom("");
    socket.emit("LeaveAllGameRoom", "lookroom");

  }

    return (
      <div className="look">
        <h4> REGARDER une partie : </h4>
        <p> wich game do you want to look at ?</p>
        
        {props.listGame.map((element: any, index: any) => {
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
}

////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////