import { Box, Grid, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { IChannel, IMessageReceived } from "./types";
import Channels from "./channels/Channels";
import ChatUserlist from "./ChatUserlist";
import { api, COOKIE_NAME } from "../../const/const";
import Conv from "./messages/Conv";
import FormChannel from "./channels/FormChannel";
import AvailableChannels from "./channels/AvailableChannels";
import ChannelContent from "./channels/ChannelContent";
import { ChatProvider } from "../../contexts/ChatContext";
import Dms from "./messages/Dms";

export enum ChatContent {
  NEW_CHANNELS,
  NEW_DM,
  MESSAGES,
  CHANNEL_CONTENT,
}

interface ChatProps { }

export default function Chat(props: ChatProps) {
  const [chatContent, setChatContent] = useState<ChatContent>(
    ChatContent.NEW_CHANNELS
  );
  const [channelData, setChannelData] = useState<IChannel>();

  async function getChannelDatas(channelName: string) {
    try {
      const res = await api.get("channel/datas", {
        params: {
          name: channelName,
        },
      });
      setChannelData(res.data);
    } catch {
      console.log("invalid get channels datas");
    }
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
