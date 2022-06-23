import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid'
import './Chat.css'
import { Input, Button } from '@chakra-ui/react'

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

  function createRoom() {
    if (username !== "" && room !== "") {
      socket.emit("createRoom", room);
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
      await socket.emit("addMessage", messageData);
      setMessagesList((list) => [...list, messageData]);
      setCurrentMessage(messageData.content);
      setAuthor(messageData.author);
    }
  }

  // listen message from backend
  useEffect(() => {
    socket.on("addMessage", (data) => {
      console.log(data);
      setMessagesList((list) => [...list, data]);
    })
  }, [socket]);

  return (
    <div className="chat">
      {!windowChat ? (
        <div className="chat-join">
          <Input
            placeholder="username"
            onChange={(event) => {
              setUsername(event.target.value);
          }}/>
           <Input
            placeholder="room"
            onChange={(event) => {
              setRoom(event.target.value);
          }}
          />
          <Button
            colorScheme='blue'
            onClick={createRoom}> Join a room
          </Button>
        </div>
      ) : (
      <div className="chat-window" >
        <div className="scrollbar">
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
            <Input
              id="standard-basic"
              variant="outlined"
              placeholder="Enter a message"
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }} />
            <img
              alt="send message img"
                src={require("../../assets/paperplane.png")}
                onClick={sendMessage}>
              </img>
            </div>
          </div>
        </div>
        )}
    </div>
  );
}