import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import './Chat.css'

const socket = io('http://localhost:4000/chat');

interface IMessage {
  room: string,
  author: string,
  content: string,
  time: string
}

export default function Chat() {

  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [windowChat, setWindowChat] = useState(false)
  const [messagesList, setMessagesList] = useState<Array<string>>([]);

  function joinRoom() {
    if (username !== "" && room !== "") {
      socket.emit("joinRoom", room);
      console.log(`User join room ${room}`);
      setWindowChat(true);
    }
  }

  async function sendMessage() {
    //const minutes =
    if (currentMessage !== "") {
      const messageData : IMessage = {
        room: room,
        author: username,
        content: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, '0'),
      };

      await socket.emit("message", messageData);
      setMessagesList((list) => [...list, currentMessage]);
      setCurrentMessage("");
    }
  }

  // listen message from backend
  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setMessagesList((list) => [...list, data]);
    })
  }, [socket]);

  /* socket.on('disconnect', () => {
    console.log(`Disconnected with ${socket.id}`);
  }); */

  return (
    <div className="chat">
      {!windowChat ? (
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
      ) : (
      <div className="chat-window" >
        <div className="chat-header">
          <p> Live chat</p>
          <input
            type="text"
            placeholder="Enter a message"
            onChange={(event) => {
            setCurrentMessage(event.target.value);
          }} />
          <input
            type="submit"
            onClick={sendMessage}
            />
        </div>
        <div className="chat-body"></div>
        <div className="chat-footer"></div>
      </div>
      )}
    </div>
  );
}