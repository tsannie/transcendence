import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useState } from 'react'
import { api, IUser } from '../../../../userlist/UserList';
import { IChannel, IChannelActions } from '../../types';

interface UnmuteUserProps {
  infosChannel: IChannel;
  getInfosChannel: (channel: IChannel) => void;
}

export default function UnmuteUser(props: UnmuteUserProps) {

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "popover-unmute" : undefined;

  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function createChannelActions(channel: IChannel, targetUsername: string) {
    const newChannel: IChannelActions = {
      channel_name: channel.name,
      target: targetUsername,
    };
    console.log("newchannel = ", newChannel);

    return newChannel;
  }

  async function unmuteUser(user: IUser, channel: IChannel) {
    const newChannel: IChannelActions = createChannelActions(channel, user.username);

    console.log("newChannel = ", newChannel);
    if (newChannel.target !== "") {
      await api
        .post("channel/unMuteUser", newChannel)
        .then((res) => {
          console.log("user unmute with success");
          console.log(channel);
          props.getInfosChannel(channel);
        })
        .catch((res) => {
          console.log("invalid unmute user");
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
        Unmute
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
          <List>
            {props.infosChannel.muted.map((user: IUser) => (
              <ListItemButton onClick={() => unmuteUser(user, props.infosChannel)}>
                {user.username}
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  )
}
