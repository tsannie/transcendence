import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useState } from 'react'
import { api } from '../../../userlist/UserList';
import { IChannel, IChannelActions } from '../types';

export default function MakeAdmin(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "popover-makeAdmin" : undefined;

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

  async function makeAdmin(user: any, channel: IChannel) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/makeAdmin", newChannel)
        .then((res) => {
          console.log("user is admin now");
          console.log(channel);
          props.getInfosChannel(channel);
        })
        .catch((res) => {
          console.log("user can't be admin");
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
        Make Admin
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
              <ListItemButton onClick={() => makeAdmin(user, props.infosChannel)}>
                {(!props.isAdmin(props.infosChannel, user.id)) ? user.username : <></>}
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  )
}
