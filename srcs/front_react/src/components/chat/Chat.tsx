import { Box, Typography } from "@mui/material";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { IChannel, IMessage } from "./types";
import MessagesList from "./messages/MessagesList";
import PromptMessage from "./messages/PromptMessage";
import Channels from "./channels/Channels";
import ChatUserlist from "./ChatUserlist";
import { api, IUser } from "../../userlist/UserList";
import { COOKIE_NAME } from "../../const";
import DmList from "./messages/DmList";
import Conv from "./messages/Conv";

export default function Chat(props: any) {
  const [room, setRoom] = useState("");
  const [author, setAuthor] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesList, setMessagesList] = useState<Array<IMessage>>([]);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [userId, setUserId] = useState(0);
  const [openConv, setOpenConv] = useState(false);

  //const socket = io("http://localhost:4000", {});

  async function getUser() {
    console.log("get user");
    await api
      .get("auth/profile")
      .then((res) => {
        setAuthor(res.data.username);
        setUserId(res.data.id);
      })
      .catch((res) => {
        console.log("invalid jwt");
      });
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
      //socket.emit("message", messageData);
      setMessagesList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  }

  // get user once on load
  useEffect(() => {
    getUser();
  }, []);

  // listen message from backend
  /* useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setMessagesList((list) => [...list, data]);
    });
  }, [socket]); */

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          //justifyContent: "space-between",
          alignItems: "flex-start",
          height: "100%",
          weight: "30%",
        }}
      >
        <DmList
          //socket={socket}
          isNewMessage={isNewMessage}
          setOpenConv={setOpenConv}
        />
        <Channels />
        <Conv
          openConv={openConv}
          messagesList={messagesList}
          author={author}
          setCurrentMessage={setCurrentMessage}
          sendMessage={sendMessage}
        />
        <ChatUserlist
          setOpenConv={setOpenConv}
          setIsNewMessage={setIsNewMessage}
          getAllUsers={props.getAllUsers}
          users={props.users}
        />
      </Box>
    </>
  );
}
