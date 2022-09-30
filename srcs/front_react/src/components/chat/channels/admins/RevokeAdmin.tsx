import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useState } from 'react'
import { api, IUser } from '../../../../userlist/UserList';
import { IChannel, IChannelActions } from '../../types';

interface RevokeAdminProps {
  infosChannel: IChannel;
  getInfosChannel: (channel: IChannel) => void;
}

export default function RevokeAdmin(props: RevokeAdminProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "popover-revokeAdmin" : undefined;

  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function createChannelActions(channel: IChannel, targetUsername: string) {
    //console.log("channel = ", channel);
    const newChannel: IChannelActions = {
      channel_name: channel.name,
      target: targetUsername,
    };
    console.log(newChannel);

    return newChannel;
  }

  async function revokeAdmin(user: IUser, channel: IChannel) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/revokeAdmin", newChannel)
        .then((res) => {
          console.log("user is not admin anymore");
          console.log(channel);
          props.getInfosChannel(channel);
        })
        .catch((res) => {
          console.log("user can't be remove to admin");
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
        Revoke Admin
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
            {props.infosChannel.admins.map((user: IUser) => (
              <ListItemButton onClick={() => revokeAdmin(user, props.infosChannel)}>
                {user.username}
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  )
}
