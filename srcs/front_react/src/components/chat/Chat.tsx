import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { IMessage } from "./types";
import ChatJoin from "./ChatJoin";
import MessagesList from "./messages/MessagesList";
import PromptMessage from "./messages/PromptMessage";
import Channels from "./channels/Channels";
import ChatUserlist from "./ChatUserlist";
import { api, IUser } from "../../userlist/UserListItem";
import { COOKIE_NAME } from "../../const";
import { ContactSupportOutlined } from "@material-ui/icons";
import HistoryMessages from "./messages/HistoryMessages";

export const socket = io("http://localhost:4000");

export default function Chat() {
  const [room, setRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [windowChat, setWindowChat] = useState(false);
  const [messagesList, setMessagesList] = useState<Array<IMessage>>([]);
  const [author, setAuthor] = useState("");
  const [username, setUsername] = useState("");
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [id, setId] = useState(0);

  function createRoom() {
    console.log(username);
    console.log(room);
    if (username !== "" && room !== "") {
      socket.emit("createRoom", room);
      console.log(`User join room ${room}`);
      setWindowChat(true);
    }
  }

  async function getUser() {
    if (document.cookie.includes(COOKIE_NAME)) {
      await api
        .get("auth/profile")
        .then((res) => {
          setId(res.data.id);
          setUsername(res.data.username);
        })
        .catch((res) => {
          console.log("invalid jwt");
          document.cookie = COOKIE_NAME + "=; Max-Age=-1;;";
        });
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

  useEffect(() => {
    getUser();
  });

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
        <ChatJoin setRoom={setRoom} createRoom={createRoom} />
      </div>
    );
  }
  return (
    <Box sx={{}}>
      <Box
        sx={{
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
        <HistoryMessages isNewMessage={isNewMessage} />
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
        <ChatUserlist setIsNewMessage={setIsNewMessage} />
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
