import { Box, Grid, Popover, Typography } from "@mui/material";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { IChannel, IMessage } from "./types";
import MessagesList from "./messages/MessagesList";
import PromptMessage from "./messages/PromptMessage";
import Channels from "./channels/Channels";
import ChatUserlist from "./ChatUserlist";
import { api, COOKIE_NAME } from "../../const/const";
import DmList from "./messages/DmList";
import Conv from "./messages/Conv";
import FormChannel from "./channels/FormChannel";
import { SocketContext, SocketProvider } from "./SocketContext";
import AvailableChannels from "./channels/AvailableChannels";
import ChannelContent from "./channels/ChannelContent";

export enum ChatContent {
  NEW_CHANNELS,
  NEW_DM,
  MESSAGES,
  CHANNEL_CONTENT,
}

interface ChatProps {}

export default function Chat(props: ChatProps) {
  const [username, setUsername] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const [channelsList, setChannelsList] = useState<IChannel[]>([]);
  const [targetUsername, setTargetUsername] = useState("");
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [userId, setUserId] = useState(0);
  const [currentChannel, setCurrentChannel] = useState<IChannel>();
  const [chatContent, setChatContent] = useState<ChatContent>(
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

  // get all channels
  async function getChannels() {

    console.log("get channels");
    await api
      .get("channel/all")
      .then((res) => {
        setChannelsList(res.data);
        console.log(res.data);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
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
      //setMessagesList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  }

  // get user once on load
  useEffect(() => {
    getUser();
  }, []);

  // get all channels
  useEffect(() => {
    getChannels();
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
    <Grid container>
      <Grid item xs={4}>
        <Grid item>
          <DmList isNewMessage={isNewMessage} setChatContent={setChatContent} />
        </Grid>
        <Grid item>
          <Channels
            setChatContent={setChatContent}
            setCurrentChannel={setCurrentChannel}
            channelsList={channelsList}
            getChannels={getChannels}
          />
        </Grid>
      </Grid>
      <Grid item xs={8}>
        {chatContent === ChatContent.MESSAGES && (
          <Conv
            messagesList={messagesList}
            //setMessagesList={setMessagesList}
            username={username}
            setCurrentMessage={setCurrentMessage}
            sendMessage={sendMessage}
          />
        )}
        {chatContent === ChatContent.NEW_CHANNELS && (
          <Grid item xs={8}>
            <Grid item xs={4}>
              <FormChannel />
            </Grid>
            <Grid item xs={4}>
              <AvailableChannels />
            </Grid>
          </Grid>
        )}
        {chatContent === ChatContent.NEW_DM && (
          <ChatUserlist
            userId={userId}
            setMessagesList={setMessagesList}
            setTargetUsername={setTargetUsername}
            setChatContent={setChatContent}
          />
        )}
        {chatContent === ChatContent.CHANNEL_CONTENT && (
          <ChannelContent
            messagesList={messagesList}
            username={username}
            setCurrentMessage={setCurrentMessage}
            sendMessage={sendMessage}
            channelData={currentChannel} // a changer pour mettre les data du channel
          />
        )}
      </Grid>
    </Grid>
  );
}
