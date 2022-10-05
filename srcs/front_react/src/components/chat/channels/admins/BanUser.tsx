import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useState } from 'react'
import { api, IUser } from '../../../../userlist/UserList';
import { IChannel, IChannelActions } from '../../types';

interface BanUserProps {
  infosChannel: IChannel;
  getInfosChannel: (channel: IChannel) => void;
}

export default function BanUser(props: BanUserProps) {
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
    //console.log("channel = ", channel);
    const newChannel: IChannelActions = {
      channel_name: channel.name,
      target: targetUsername,
    };
    console.log(newChannel);

    return newChannel;
  }

  async function banUser(user: IUser, channel: IChannel) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/banUser", newChannel)
        .then((res) => {
          console.log("user ban with success");
          console.log(channel);
          props.getInfosChannel(channel);
        })
        .catch((res) => {
          console.log("invalid channels");
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
        Ban
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
        {open && (
          <List>
            {props.infosChannel.users.map((user: IUser) => (
              <ListItemButton onClick={() => banUser(user, props.infosChannel)}>
                {user.username}
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  )
}
