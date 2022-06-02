import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');

function Msg() {
  console.log('fewef');
  socket.emit('events', { name: 'Nest'}, (data: string) => {
    console.log(data);
  });
  //socket.on('events', (data) => console.log(data));
  /* socket.on('connection', () => {
    console.log('Connected in front')
    socket.emit('events', { test: 'test'});
  });
  socket.on('events', (data) => {
    console.log('event', data);
  });
  socket.on('disconnect', () => {
    console.log('Disconnected');
  }); */
  return (
  <h1>
      { }
  </h1>
  );
}
export default Msg;
