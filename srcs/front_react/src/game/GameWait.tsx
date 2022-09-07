import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ballObj, player_left, player_right, socket } from "./Game";


export function The_whole_creation(store: any) {

  function StartGame(rom: string) {
    socket.emit("startGameRoom", rom);
  }

  useEffect(() => {
    socket.on("readyGame", (theroom) => {
      store.setColor_ready("green");
      if (
        (theroom.p2 == socket.id && theroom.p2_ready == true) ||
        (theroom.p1 == socket.id && theroom.p1_ready == true)
      )
      store.setimready(true);
      if (
        (theroom.p1 != socket.id && theroom.p1_ready == true) ||
        (theroom.p2 != socket.id && theroom.p2_ready == true)
      )
      store.setopready(true);
      if (theroom.p1_ready == true && theroom.p2_ready == true) {
        store.setRoom(theroom.room_name);
        StartGame(theroom.room_name);
        store.setgamestart(true);
      }
    });

    socket.on("joinedRoom", (theroom) => {
      store.setnbrconnect(theroom.nbr_co);
      store.setisinroom(true);
      store.setRoom(theroom.room_name);

      if (theroom.p2 == socket.id) {
        store.setop_id(theroom.p1);
        store.setim_right(true);
      } else if (theroom.p1 == socket.id) {
        store.setop_id(theroom.p2);
        store.setim_right(false);
      }
    });
    store.setisFull("");
    store.setmy_id(socket.id);

  }, [socket]);


} 
export function GameWaitReady(props: any) {


  function ReadyGame() {
    props.setColor_ready("green");
    socket.emit("readyGameRoom", props.room);
  }

  return (
    <div className="readytoplay">
      <h2> you are : {props.my_id} </h2>
      <p> THE ROOM "{props.room}" IS READY TO PLAY </p>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>
      <button style={{ color: props.color_ready }} onClick={ReadyGame}>
        {" "}
        READY ? {props.room}
      </button>

      <b>
        {props.opready ? (
          <h2 style={{ color: props.color_ready }}> opponent {props.op_id} is ready </h2>
        ) : (
          <h2> waiting for : {props.op_id} </h2>
        )}
      </b>
    </div>
  );
};