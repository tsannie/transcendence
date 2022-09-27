import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useState } from 'react'
import { api } from '../../../userlist/UserListItem';
import { IChannel, IChannelActions } from '../types';

export default function UnmuteUser(props: any) {

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "popover-ban" : undefined;

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

  async function unmuteUser(user: any, channel: IChannel) {
    const newChannel: IChannelActions = createChannelActions(channel, user.username);

    console.log("newChannel = ", newChannel);
    if (newChannel.target !== "") {
      await api
        .post("channel/unmuteUser", newChannel)
        .then((res) => {
          console.log("user unmute with success");
          console.log(channel);
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
          <List
            key={props.channelData.users.id}
          >
            {props.channelData.users.map((user: any) => (
              <ListItemButton onClick={() => unmuteUser(user, props.channelData)}>
                {user.username}
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  )
}
