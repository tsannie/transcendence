import { Button, List, ListItemButton, Popover } from "@mui/material";
import { Channel } from "diagnostics_channel";
import React, { useContext, useState } from "react";
import { api } from "../../../../const/const";
import { ChannelsContext } from "../../../../contexts/ChannelsContext";
import { UserContext } from "../../../../contexts/UserContext";
import { IChannelActions } from "../../types";

interface BanUserProps {
  userTargeted: any;
  getChannelDatas: any;
  channelData: any;
}

export default function BanUser(props: BanUserProps) {

  const { getUser } = useContext(UserContext);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    banUser(props.userTargeted, props.channelData);
    props.getChannelDatas(props.channelData.data.name);
    getUser();
  }

  function createChannelActions(channel: any, targetUsername: string) {
    const newChannel: IChannelActions = {
      channel_name: channel.data.name,
      target: targetUsername,
    };
    console.log(newChannel);
    return newChannel;
  }

  async function banUser(user: any, channel: any) {
    const newChannel = createChannelActions(channel, user.username);

    console.log("newChannel = ", newChannel);
    if (newChannel.target !== "") {
      await api
        .post("channel/banUser", newChannel)
        .then((res) => {
          console.log("user ban with success");
          props.channelData.data.banned = res.data.banned;
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
      Ban
    </Button>
  );
}
