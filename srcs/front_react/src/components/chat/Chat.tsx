import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket = io('http://localhost:4000/chat');

export default function Chat() {

  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  function joinRoom() {
    //console.log(username);
    //console.log(room);
    if (username !== "" && room !== "") {
      socket.emit("joinRoom", room);
      console.log("socket emit in react front");
    }
  }

  function Recv_msg() {
    socket.on('events', (data) => {
      console.log('msgToClient', data);
    });
  }

  function Send_msg() {
    //console.log('send_msg');
    socket.on('connect', () => {
      console.log(`Connected with ${socket.id}`);
      socket.emit('events', { name: 'Nest' }, (data: string) => console.log(data));
    });
  }
  socket.on('disconnect', () => {
    console.log(`Disconnected with ${socket.id}`);
  });

  return (
  <div>
    <div className="chat">
      <div className="chat-join">
        <h1> Join a chat </h1>
        <input
          type="text"
          placeholder="client1"
          onChange={(event) => {
            setUsername(event.target.value);
        }}/>
        <input
        type="text"
        placeholder="RoomID"
        onChange={(event) => {
          setRoom(event.target.value);
        }}
        />
        <button onClick={joinRoom}> Join a room </button>
      </div>
      <div className="chat-header">
        <p> Live chat</p>
        <input type="text" placeholder="Enter an user" />
        <input type="submit" />
      </div>
      <div className="chat-body"></div>
      <div className="chat-footer"></div>
    </div>
  </div>
  );
}