import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useState } from 'react'
import { api } from '../../../../const/const';
import { IChannel, IChannelActions } from '../../types';

interface MuteUserProps {
  userTargeted: any;
  channelData: any;
}

export default function MuteUser(props: MuteUserProps) {

  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    console.log("ban user", props.channelData);
    muteUser(props.userTargeted, props.channelData);
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

  async function muteUser(user: any, channel: any) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/muteUser", newChannel)
        .then((res) => {
          console.log("user mute with success");
          console.log(channel);
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
      Mute
    </Button>
  )
}
