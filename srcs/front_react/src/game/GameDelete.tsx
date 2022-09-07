import React, { useEffect, useState } from "react";
import { ballObj, player_left, player_right, socket } from "./Game";


export default function The_whole_delete(store: any) {

  useEffect(() => {
    socket.on("leftRoom", (theroom) => {
      store.setnbrconnect(theroom.nbr_co);
      store.setopready(false);
      store.setimready(false);
      store.setgamestart(false);
      store.setop_id("");
  
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
      store.setnbrconnect(0);
      store.setopready(false);
      store.setimready(false);
      store.setop_id("");
    });

    store.setisFull("");
    store.setmy_id(socket.id);
    socket.on("roomFull", (theroom) => {
      store.setisFull("This ROOM IS FULL MATE");
      console.log("THIS ROOM IS FULL");
    });
  }, [socket]);

}