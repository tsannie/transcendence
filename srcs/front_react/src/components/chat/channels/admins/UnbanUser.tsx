import { Button, List, ListItemButton, Popover } from '@mui/material';
import React, { useState } from 'react'
import { api, IUser } from '../../../../userlist/UserList';
import { IChannel, IChannelActions } from '../../types';

interface UnbanUserProps {
  infosChannel: any;
  getInfosChannel: (channel: IChannel) => void;
}

export default function UnbanUser(props: UnbanUserProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "popover-unban" : undefined;

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

  async function unbanUser(user: IUser, channel: IChannel) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/unBanUser", newChannel)
        .then((res) => {
          console.log("user unban with success");
          console.log(channel);
          props.getInfosChannel(channel);
        })
        .catch((res) => {
          console.log("invalid unban user");
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
            key={props.infosChannel.banned.id}
          >
            {props.infosChannel.banned.map((user: IUser) => (
              <ListItemButton onClick={() => unbanUser(user, props.infosChannel)}>
                {user.username}
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  )
}
