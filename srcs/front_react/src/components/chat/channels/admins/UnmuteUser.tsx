import { Button, List, ListItemButton, Popover } from "@mui/material";
import React, { useContext, useState } from "react";
import { api } from "../../../../const/const";
import { ChannelsContext } from "../../../../contexts/ChannelsContext";
import { IChannel, IChannelActions } from "../../types";

interface UnmuteUserProps {
  userTargeted: any;
  getChannelDatas: any;
  channelData: any;
}

export default function UnmuteUser(props: UnmuteUserProps) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    //console.log("ban user", channelData);
    unmuteUser(props.userTargeted, props.channelData);
    props.getChannelDatas(props.channelData.data.name);
  }

  function createChannelActions(channel: any, targetUsername: string) {
    //console.log("channel = ", channel);
    const newChannel: IChannelActions = {
      channel_name: channel.data.name,
      target: targetUsername,
    };
    console.log(newChannel);
    return newChannel;
  }

  async function unmuteUser(user: any, channel: any) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/unMuteUser", newChannel)
        .then((res) => {
          console.log("user ban with success");
          props.channelData.data.muted = res.data.muted;
          props.getChannelDatas(props.channelData.data.name);
        })
        .catch((res) => {
          console.log("invalid channels");
          console.log(res);
        });
    }
  }

  return (
    <Button
      sx={{
        color: "black",
        ml: "1vh",
      }}
      onClick={(event) => {
        handleClick(event);
      }}
    >
      Unmute
    </Button>
  );
}
