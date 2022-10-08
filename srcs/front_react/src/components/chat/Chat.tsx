import { Box, Grid, Popover, Typography } from "@mui/material";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { IChannel, IConvCreated, IMessage } from "./types";
import MessagesList from "./messages/MessagesList";
import PromptMessage from "./messages/PromptMessage";
import Channels from "./channels/Channels";
import ChatUserlist from "./ChatUserlist";
import { api, COOKIE_NAME } from "../../const/const";
import DmList from "./messages/DmList";
import Conv from "./messages/Conv";
import FormChannel from "./channels/FormChannel";
import { SocketContext, SocketProvider } from "../../contexts/SocketContext";
import AvailableChannels from "./channels/AvailableChannels";
import ChannelContent from "./channels/ChannelContent";
import {
  ChannelsContext,
  ChannelsProvider,
} from "../../contexts/ChannelsContext";
import { MessagesContext, MessagesProvider } from "../../contexts/MessagesContext";
import { UserContext, UserProvider } from "../../contexts/UserContext";

export enum ChatContent {
  NEW_CHANNELS,
  NEW_DM,
  MESSAGES,
  CHANNEL_CONTENT,
}

interface ChatProps {}

export default function Chat(props: ChatProps) {
  const [dmsList, setDmsList] = useState<IConvCreated[]>([]);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [isOpenInfos, setIsOpenInfos] = useState(false);
  const [userId, setUserId] = useState(0);
  const [chatContent, setChatContent] = useState<ChatContent>(
    ChatContent.NEW_CHANNELS
  );
  // enum with 3 strings differentes

  const socket = useContext(SocketContext);
  const messages = useContext(MessagesContext);
  const user = useContext(UserContext);

  // get all dms
  async function getDmsList() {
    console.log("get dms");
    await api
      .get("dm/list", {
        params: {
          offset: 1,
        },
      })
      .then((res) => {
        setDmsList(res.data);
      })
      .catch((res) => {
        console.log("invalid dms");
        console.log(res);
      });
  }


  return (
    <ChannelsProvider>
      <MessagesProvider>
        <UserProvider>
        <Grid container>
          <Grid item xs={4}>
            <Grid item>
              <DmList
                isNewMessage={isNewMessage}
                setChatContent={setChatContent}
                getDmsList={getDmsList}
                dmsList={dmsList}
              />
            </Grid>
            <Grid item>
              <Channels
                setIsOpenInfos={setIsOpenInfos}
                setChatContent={setChatContent}
              />
            </Grid>
          </Grid>
          <Grid item xs={8}>
            {chatContent === ChatContent.MESSAGES && (
              <Conv
                //username={user.username}
                //sendMessage={messages.sendMessage}
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
                getDmsList={getDmsList}
                dmsList={dmsList}
                setChatContent={setChatContent}
              />
            )}
            {chatContent === ChatContent.CHANNEL_CONTENT && isOpenInfos && (
              <ChannelContent
                isOpenInfos={isOpenInfos}
                //username={username}
                //sendMessage={messages.sendMessage}
              />
            )}
          </Grid>
        </Grid>
        </UserProvider>
      </MessagesProvider>
    </ChannelsProvider>
  );
}
