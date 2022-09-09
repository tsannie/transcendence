import { useEffect, useState } from "react";
import { socket } from "../Game";

////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////


export function GameSpectator(props: any) {

  
  useEffect(() => {
    socket.on("getAllGameRoom", (theroom: Map<any, any>) => {
      props.store.setisLookingRoom(true);
      //console.log("getAllGameRoom watch client side");

      console.log("1 socker");
      let donot = false;
      let key2;
      for (const [key, value] of Object.entries(theroom)) {
        //console.log("first[" + key + "]");
        //props.store.setListGame(key);
        //setNames(prevNames => [...prevNames, 'Bob'])}
        //props.store.setListGame((prevNames: any) => [...prevNames, key]);
        //props.store.listGame.

          console.log(props.store.listGame.length);
          for (let i = 0; i < props.store.listGame.length; i++) {
            key2 = props.store.listGame[i];
            //console.log("-[" + key2 + "][" + key + "]");
            //console.log(props.store.listGame[i]);
            if (key === key2) {
              donot = true;
            }
          }

          if (donot === false) {
            //props.store.setListGame((prevNames: any) => [...prevNames, key]);
            props.store.listGame.push(key);
          } else {
            donot = false;
          }
        
        }
        
        for (let i = 0; i < props.store.listGame.length; i++) {
          key2 = props.store.listGame[i];
          //console.log("-[" + key2 + "][" + key + "]");
          console.log("all list = " + props.store.listGame[i]);
  
        }
    });


  }, [socket]);

  function lookthegame() {
/*     //props.store.setisLookingRoom(false);

    console.log(
      "lookthegamelookthegamelookthegamelookthegamelookthegame lookthegame"
    );
    //console.log(listGame)

    console.log("" + props.store.lookingroom);
    socket.emit("lookGameRoom", props.store.lookingroom); */
  }

  function leavelookingroom() {
    props.store.setisLookingRoom(false);
    props.store.setLookingRoom("");
    props.store.listGame = [];
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
