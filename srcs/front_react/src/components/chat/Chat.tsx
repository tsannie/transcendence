import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid'
import './Chat.css'

const socket = io('http://localhost:4000/chat');

interface IMessage {
  id: string,
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
  const [messagesList, setMessagesList] = useState<Array<IMessage>>([]);
  const [author, setAuthor] = useState('');

  function joinRoom() {
    if (username !== "" && room !== "") {
      socket.emit("joinRoom", room);
      console.log(`User join room ${room}`);
      setWindowChat(true);
    }
  }

  async function sendMessage() {
    if (currentMessage !== "") {
      const messageData : IMessage = {
        id: uuidv4(),
        room: room,
        author: username,
        content: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, '0'),
      };
      await socket.emit("message", messageData);
      setMessagesList((list) => [...list, messageData]);
      setCurrentMessage(messageData.content);
      setAuthor(messageData.author);
    }
  }

  // listen message from backend
  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setMessagesList((list) => [...list, data]);
    })
  }, [socket]);

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
        </div>
        <div className="chat-body">
          <div className="messages-list">
            { messagesList.map((messageData) => {
              return <div
                className={ author === messageData.author ? ("sender") : "receiver"}
                key={ messageData.id }> { messageData.content} </div>
            })}
          </div>
        </div>
        <div className="chat-footer">
          <input
              type="text"
              placeholder="Enter a message"
              onChange={(event) => {
              setCurrentMessage(event.target.value);
            }} />
          <img
            alt="send message img"
            src={require("../../assets/paperplane.png")}
            //src="https://i.pinimg.com/236x/15/c7/d1/15c7d10a7f8dbb14c3d8a8059c593509--tokyo-ghoul.jpg"
            onClick={sendMessage}>
          </img>
        </div>
      </div>
      )}
    </div>
  );
}