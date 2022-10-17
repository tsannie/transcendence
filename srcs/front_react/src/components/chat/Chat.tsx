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
import DmList from "./messages/DmsList";
import Conv from "./messages/Conv";
import FormChannel from "./channels/FormChannel";
import { SocketContext, SocketProvider } from "../../contexts/SocketContext";
import AvailableChannels from "./channels/AvailableChannels";
import ChannelContent from "./channels/ChannelContent";
import {
  ChannelsContext,
  ChannelsProvider,
} from "../../contexts/ChannelsContext";
import {
  MessagesContext,
  MessagesProvider,
} from "../../contexts/MessagesContext";
import { UserContext, UserProvider } from "../../contexts/UserContext";
import { ChatProvider } from "../../contexts/ChatContext";
import Dms from "./messages/Dms";

export enum ChatContent {
  NEW_CHANNELS,
  NEW_DM,
  MESSAGES,
  CHANNEL_CONTENT,
}

interface ChatProps {}

export default function Chat(props: ChatProps) {
  const [chatContent, setChatContent] = useState<ChatContent>(
    ChatContent.NEW_CHANNELS
  );
  const [channelData, setChannelData] = useState<IChannel>();
  console.log("chatContent", chatContent);

  async function getChannelDatas(channelName: string) {
    await api
      .get("channel/datas", {
        params: {
          name: channelName,
        },
      })
      .then((res) => {
        console.log(res.data);
        setChannelData(res.data);
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
  }

  return (
    <ChatProvider>
      <Grid container>
        <Grid item xs={4}>
          <Grid item>
            <Dms setChatContent={setChatContent} />
          </Grid>
          <Grid item>
            <Channels
              setChatContent={setChatContent}
              getChannelDatas={getChannelDatas}
            />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          {chatContent === ChatContent.MESSAGES && <Conv />}
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
            <ChatUserlist setChatContent={setChatContent} />
          )}
          {chatContent === ChatContent.CHANNEL_CONTENT && (
            <ChannelContent
              getChannelDatas={getChannelDatas}
              channelData={channelData}
            />
          )}
        </Grid>
      </Grid>
    </ChatProvider>
  );
}
