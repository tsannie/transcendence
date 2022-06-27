import {
  Button,
  CssBaseline,
  darkScrollbar,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "./Chat.css";
import { createTheme } from "@mui/material/styles";
import { IMessage } from "./types";

const socket = io("http://localhost:4000/chat");

export default function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [windowChat, setWindowChat] = useState(false);
  const [messagesList, setMessagesList] = useState<Array<IMessage>>([]);
  const [author, setAuthor] = useState("");

  function createRoom() {
    if (username !== "" && room !== "") {
      socket.emit("createRoom", room);
      console.log(`User join room ${room}`);
      setWindowChat(true);
    }
  }

  async function sendMessage() {
    if (currentMessage !== "") {
      const messageData: IMessage = {
        id: uuidv4(),
        room: room,
        author: username,
        content: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, "0"),
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
    });
  }, [socket]);

  if (!windowChat) {
    return (
      <div className="chat">
        <div className="chat-join">
          <TextField
            variant="outlined"
            placeholder="username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <TextField
            variant="outlined"
            placeholder="room"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <Button sx={{ height: 56 }} variant="contained" onClick={createRoom}>
            Join a room
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat-window">
        <div className="chat-header">
          <p> Live chat</p>
        </div>
        <div className="chat-body">
          <div className="messages-list">
            {messagesList.map((messageData) => {
              return (
                <div
                  className={
                    author === messageData.author ? "sender" : "receiver"
                  }
                  key={messageData.id}
                >
                  {messageData.content}
                </div>
              );
            })}
          </div>
        </div>
        <div className="chat-footer">
          <TextField
            id="standard-basic"
            variant="outlined"
            placeholder="Enter a message"
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
          />
          <img
            alt="send message img"
            src={require("../../assets/paperplane.png")}
            onClick={sendMessage}
          ></img>
        </div>
      </div>
    </div>
  );
}
