import { useEffect, useState } from "react";
import { socket } from "../Game";

////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////

export function GameSpectator(props: any) {
  useEffect(() => {
    socket.on("getAllGameRoom", (theroom: Map<any, any>) => {
      console.log("getAllGameRoom watch client side");

      console.log("1 socker");

      for (const [key, value] of Object.entries(theroom)) {
        console.log("rooma are : [" + key + "][" + "]");
      }

      console.log("2 socket");
    });
  }, [socket]);

  function lookthegame() {
    //setisLookingRoom(false);

    console.log(
      "lookthegamelookthegamelookthegamelookthegamelookthegame lookthegame"
    );
    //console.log(listGame)

    console.log("/*/**//*/**/   " + props.store.lookingroom);
    socket.emit("lookGameRoom", props.store.lookingroom);
  }

  function leavelookingroom() {
    props.store.setisLookingRoom(false);
    props.store.setLookingRoom("");
    console.log("list when living '" + props.store.listGame);
    props.store.setListGame([]);
    console.log("list when living then '" + props.store.listGame);
  }

  return (
    <div className="look">
      <h4> REGARDER une partie : </h4>
      <p> wich game do you want to look at ?</p>
      {props.store.listGame.map((element: any, index: any) => {
        props.store.setLookingRoom(element);
        return (
          <div key={index}>
            <p>
              partie : "{element}"{" "}
              <button onClick={lookthegame}>regarder la partie</button>
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
