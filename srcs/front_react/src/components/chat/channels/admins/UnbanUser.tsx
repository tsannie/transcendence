import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useContext, useState } from 'react'
import { api } from '../../../../const/const';
import { ChannelsContext } from '../../../../contexts/ChannelsContext';
import { IChannel, IChannelActions } from '../../types';

interface UnbanUserProps {
  userTargeted: any;
}

export default function UnbanUser(props: UnbanUserProps) {

  const { channelData } = useContext(ChannelsContext);

  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    console.log("unban user", channelData);
    unbanUser(props.userTargeted, channelData);
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

  async function unbanUser(user: any, channel: any) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/unBanUser", newChannel)
        .then((res) => {
          console.log("user ban with success");
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
      Unban
    </Button>
  )
}
