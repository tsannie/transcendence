import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket = io('http://localhost:4000');

function Recv_msg() {
  socket.on('events', (data) => {
    console.log('msgToClient', data);
  });
}

function Send_msg() {
  //console.log('send_msg');
  socket.on('connect', () => {
    console.log('Connected');
    socket.emit('events', 'reactToNest');
  });
}

function Msg() {
  //console.log('msg');
  Recv_msg();
  Send_msg();
  return (
  <h1>
      { }
  </h1>
  );
}

export default Msg;
