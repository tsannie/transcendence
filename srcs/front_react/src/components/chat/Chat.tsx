import {
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { IMessage } from "./types";
import Chat_join from "./Chat_join";
import Messages_list from "./Messages_list";
import Prompt_message from "./Prompt_message";

const socket = io("http://localhost:4000");

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
      <div>
        <Chat_join
          setUsername={setUsername}
          setRoom={setRoom}
          createRoom={createRoom}
        />
      </div>
    );
  }
  return (
    <Box
      sx={{
        position: "absolute",
        width: 640,
        height: 1024,
        top: 0,
        bottom: 0,
        left: 88,
      }}
    >
      <Box
        sx={{
          width: 640,
          height: 80,
          textAlign: "center",
        }}
      >
        Live chat
      </Box>
      <div>
        <Messages_list messagesList={messagesList} author={author} />
      </div>
      <div>
        <Prompt_message
          setCurrentMessage={setCurrentMessage}
          sendMessage={sendMessage}
        />
      </div>
    </Box>
  );
}
