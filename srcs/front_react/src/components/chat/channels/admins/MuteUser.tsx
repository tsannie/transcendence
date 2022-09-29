import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useState } from 'react'
import { api } from '../../../../userlist/UserList';
import { IChannel, IChannelActions } from '../../types';

export default function MuteUser(props: any) {

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "popover-mute" : undefined;

  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function isMuted(channel: any, user: any) {
    if (channel !== undefined) {
      for (let i = 0; i < channel.muted.length; i++) {
        console.log(channel.muted[i].id);
        console.log(props.userId);
        if (channel.muted[i].id === user.id) {
          return true;
        }
      }
    }
    console.log("isMuted = false");
    return false;
  }

  function createChannelActions(channel: IChannel, targetUsername: string) {
    const newChannel: IChannelActions = {
      channel_name: channel.name,
      target: targetUsername,
    };
    //console.log("newchannel = ", newChannel);

    return newChannel;
  }

  async function muteUser(user: any, channel: IChannel) {
    const newChannel: IChannelActions = createChannelActions(channel, user.username);

    //console.log("newChannel = ", newChannel);
    if (newChannel.target !== "") {
      await api
        .post("channel/muteUser", newChannel)
        .then((res) => {
          console.log("user mute with success");
          console.log(channel);
          props.getInfosChannel(channel);
        })
        .catch((res) => {
          console.log("invalid mute user");
          console.log(res);
        });
    }
  }

  return (
    <>
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
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {open === true && (
          <List
            key={props.infosChannel.users.id}
          >
            {props.infosChannel.users.map((user: any) => (
              <ListItemButton onClick={() => muteUser(user, props.infosChannel)}>
                {(!isMuted(props.infosChannel, user)) ? user.username : <></>}
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  )
}
