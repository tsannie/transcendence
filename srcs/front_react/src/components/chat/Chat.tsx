import {
  Box, Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { IMessage } from "./types";
import Chat_join from "./Chat_join";
import Messages_list from "./Messages_list";
import Prompt_message from "./Prompt_message";
import Channels from "./channels/Channels";

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

      }}
    >
      <Box
        sx={{
          width: 640,
          height: 80,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold"
          }}
          variant="h4"
          component="p">
          Live chat
        </Typography>
      </Box>
      <Box>
        <Messages_list messagesList={messagesList} author={author} />
      </Box>
      <Box
      >
        <Prompt_message
          setCurrentMessage={setCurrentMessage}
          sendMessage={sendMessage}
        />
      </Box>
      <Box sx={{
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
