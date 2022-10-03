import { Box, Grid, Popover, Typography } from "@mui/material";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
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
import FormChannel from "./channels/FormChannel";
import { SocketContext, SocketProvider } from "./SocketContext";

export enum ChatContent {
  NEW_CHANNELS,
  NEW_DM,
  MESSAGES,
}

interface ChatProps {
  getAllUsers: () => Promise<void>;
  users: IUser[];
}

export default function Chat(props: ChatProps) {
  const [username, setUsername] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const [targetUsername, setTargetUsername] = useState("");
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [userId, setUserId] = useState(0);
  const [channelsList, setChannelsList] = useState<IChannel[]>([]);

  const [enumState, setEnumState] = useState<ChatContent>(
    ChatContent.NEW_CHANNELS
  );
  // enum with 3 strings differentes

  const socket = useContext(SocketContext);

  async function getUser() {
    console.log("get user");
    await api
      .get("auth/profile")
      .then((res) => {
        setUsername(res.data.username);
        setUserId(res.data.id);
      })
      .catch((res) => {
        console.log("invalid jwt");
      });
  }

  function sendMessage() {
    console.log("send message");
    const inputMessage = document.getElementById(
      "input-message"
    ) as HTMLInputElement;

    inputMessage.value = "";
    if (currentMessage !== "") {
      const messageData: IMessage = {
        author: username,
        content: currentMessage,
        target: targetUsername,
      };
      console.log(messageData);
      console.log(socket);
      socket.emit("message", messageData);
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
    console.log("listen message");
    socket.on("message", (data) => {
      console.log(data);
      setMessagesList((list) => [...list, data]);
    });
  }, [socket]); */

  return (
    <SocketProvider>
      <Grid container>
        <Grid item xs={4}>
          <Grid item>
            <DmList
              isNewMessage={isNewMessage}
              setEnumState={setEnumState}
              getAllUsers={props.getAllUsers}
              users={props.users}
            />
          </Grid>
          <Grid item>
            <Channels
              channelsList={channelsList}
              setChannelsList={setChannelsList}
              setEnumState={setEnumState}
            />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          {enumState === ChatContent.MESSAGES && (
            <Conv
              messagesList={messagesList}
              //setMessagesList={setMessagesList}
              username={username}
              setCurrentMessage={setCurrentMessage}
              sendMessage={sendMessage}
            />
          )}
          {enumState === ChatContent.NEW_CHANNELS && (
            <FormChannel setChannelsList={setChannelsList} />
          )}

          {enumState === ChatContent.NEW_DM && (
            <ChatUserlist
              //setMessagesList={setMessagesList}
              setTargetUsername={setTargetUsername}
              setEnumState={setEnumState}
              getAllUsers={props.getAllUsers}
              users={props.users}
            />
          )}
        </Grid>
      </Grid>
    </SocketProvider>
  );
}
