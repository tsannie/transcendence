import { Button, List, ListItemButton, Popover } from "@mui/material";
import React, { useContext, useState } from "react";
import { api } from "../../../../const/const";
import { ChannelsContext } from "../../../../contexts/ChannelsContext";
import { SnackbarContext, SnackbarContextType } from "../../../../contexts/SnackbarContext";
import { UserContext } from "../../../../contexts/UserContext";
import { IChannel, IChannelActions } from "../../types";

interface UnbanUserProps {
  userTargeted: any;
  getChannelDatas: any;
  channelData: any;
  setBannedOpen: any;
}

export default function UnbanUser(props: UnbanUserProps) {

  const { setMessage, setOpenSnackbar, setSeverity } = useContext(SnackbarContext) as SnackbarContextType;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    unbanUser(props.userTargeted, props.channelData);
    props.getChannelDatas(props.channelData.data.name);
    props.setBannedOpen(false);
  }

  function createChannelActions(channel: any, targetUsername: string) {
    const newChannel: IChannelActions = {
      channel_name: channel.data.name,
      target: targetUsername,
    };
    console.log(newChannel);
    return newChannel;
  }

  async function unbanUser(user: any, channel: any) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/unBanUser", newChannel)
        .then((res) => {
          setSeverity("success");
          setMessage("user unbanned");
          setOpenSnackbar(true);
          props.channelData.data.banned = res.data.banned;
          props.getChannelDatas(props.channelData.data.name);
        })
        .catch((res) => {
          console.log("invalid channels");
          console.log(res);
          setSeverity("error");
          setMessage(res.response.data.message);
          setOpenSnackbar(true);
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
      Unban
    </Button>
  );
}
