import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../const/const";
import Conv from "../messages/Conv";
import MessagesList from "../messages/MessagesList";
import { IChannel } from "../types";
import AdminsActions from "./admins/AdminsActions";
import InfosChannels from "./InfosChannels";

interface ChannelContentProps {
  isOpenInfos: boolean;
  messagesList: any[];
  username: string;
  setCurrentMessage: (message: string) => void;
  sendMessage: () => void;
  channelData: any;
}

export default function ChannelContent(props: ChannelContentProps) {

  console.log("channel data", props.channelData);
  console.log("isopeninfos", props.isOpenInfos);
  return (
    <Grid container>
      <Grid item xs={9}>
        <Conv
          messagesList={props.messagesList}
          //setMessagesList={setMessagesList}
          username={props.username}
          setCurrentMessage={props.setCurrentMessage}
          sendMessage={props.sendMessage}
        />
      </Grid>
      <Grid item xs={3}>
        <InfosChannels channelData={props.channelData} username={props.username}/>
      </Grid>
    </Grid>
  );
}
