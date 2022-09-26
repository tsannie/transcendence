import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useState } from 'react'
import { api } from '../../../userlist/UserListItem';
import { IChannel, IChannelActions } from '../types';

export default function UnbanUser(props: any) {
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
    console.log("channel = ", channel);
    const newChannel: IChannelActions = {
      channel_name: channel.name,
      target: targetUsername,
    };
    console.log(newChannel);

    return newChannel;
  }

  async function unbanUser(user: any, channel: IChannel) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/unbanUser", newChannel)
        .then((res) => {
          console.log("user unban with success");
          console.log(channel);
        })
        .catch((res) => {
          console.log("invalid unban user");
          console.log(res);
        });
    }
  }

  return (
    <div>
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
              <ListItemButton onClick={() => unbanUser(user, props.channelData)}>
                {user.username}
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </div>
  )
}
