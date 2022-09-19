import { Box, Typography } from "@mui/material";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { IChannel, IMessage } from "./types";
import MessagesList from "./messages/MessagesList";
import PromptMessage from "./messages/PromptMessage";
import Channels from "./channels/Channels";
import ChatUserlist from "./ChatUserlist";
import { api, IUser } from "../../userlist/UserListItem";
import { COOKIE_NAME } from "../../const";
import HistoryMessages from "./messages/HistoryMessages";

export default function Chat() {
  const [room, setRoom] = useState("");
  const [author, setAuthor] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesList, setMessagesList] = useState<Array<IMessage>>([]);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [userId, setUserId] = useState(0);
  const [openConv, setOpenConv] = useState(false);

  const socket = io("http://localhost:4000", {
    /* auth: {
      query: {
        username: author,
      },
    }, */
  });

  // to do: creer un tableau de conversations

  /* function createRoom() {
    if (room !== "") {
      socket.emit("createRoom", room);
      console.log(`User join room ${room}`);
    }
  } */

  async function getUser() {
    console.log("get user");
    if (document.cookie.includes(COOKIE_NAME)) {
      await api
        .get("auth/profile")
        .then((res) => {
          setAuthor(res.data.username);
          setUserId(res.data.id);
        })
        .catch((res) => {
          console.log("invalid jwt");
          document.cookie = COOKIE_NAME + "=; Max-Age=-1;;";
        });
    }
  }

  function sendMessage() {
    const inputMessage = document.getElementById(
      "input-message"
    ) as HTMLInputElement;

    inputMessage.value = "";
    if (currentMessage !== "") {
      const messageData: IMessage = {
        author: author,
        content: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, "0"),
      };
      socket.emit("message", messageData);
      setMessagesList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  // listen message from backend
  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setMessagesList((list) => [...list, data]);
    });
  }, [socket]);

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
        <HistoryMessages
          isNewMessage={isNewMessage}
          setOpenConv={setOpenConv}
        />
      </Box>
      <Box>
        {openConv && (
          <MessagesList messagesList={messagesList} author={author} />
        )}
      </Box>
      <Box>
        {openConv && (
          <PromptMessage
            setCurrentMessage={setCurrentMessage}
            currentMessage={currentMessage}
            sendMessage={sendMessage}
          />
        )}
      </Box>
      <Box>
        <ChatUserlist
          setOpenConv={setOpenConv}
          setIsNewMessage={setIsNewMessage}
        />
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
