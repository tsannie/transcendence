import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { IMessage } from "./types";
import ChatJoin from "./ChatJoin";
import MessagesList from "./MessagesList";
import PromptMessage from "./PromptMessage";
import Channels from "./channels/Channels";
import ChatUserlist from "./ChatUserlist";

export const socket = io("http://localhost:4000");

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
    const inputMessage = document.getElementById(
      "input-message"
    ) as HTMLInputElement;

    inputMessage.value = "";
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
      setCurrentMessage("");
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
        <ChatJoin
          setUsername={setUsername}
          setRoom={setRoom}
          createRoom={createRoom}
        />
      </div>
    );
  }
  return (
    <Box sx={{}}>
      <Box
        sx={{
          width: 640,
          height: 80,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
          }}
          variant="h4"
        >
          Live chat
        </Typography>
      </Box>
      <Box>
        <MessagesList messagesList={messagesList} author={author} />
      </Box>
      <Box>
        <PromptMessage
          setCurrentMessage={setCurrentMessage}
          currentMessage={currentMessage}
          sendMessage={sendMessage}
        />
      </Box>
      <Box>
        <ChatUserlist />
      </Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          float: "right",
        }}
      >
        <Channels />
      </Box>
    </Box>
  );
}
