import { Button, List, ListItem, ListItemText, Popover } from "@mui/material";
import React, { useState } from "react";
import { api } from "../../../const/const";
import { IChannel } from "../types";

interface InfosChannelsProps {
  channelData: IChannel;
  userId: number;
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [infosChannel, setInfosChannel] = useState<IChannel>(props.channelData);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [channelId, setChannelId] = useState(0);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // check if user is admin of the channel in infosChannel
  function isAdmin(channel: IChannel, id: number) {
    if (infosChannel === undefined) getInfosChannel(channel);
    if (channel !== undefined) {
      for (let i = 0; i < channel.admins.length; i++) {
        if (channel.admins[i].id === id) {
          return true;
        }
      }
    }
    return false;
  }

  function handleClick(
    channel: IChannel,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    setAnchorEl(event.currentTarget);
    getInfosChannel(channel);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  async function getInfosChannel(channel: IChannel) {
    console.log("333");

    await api
      .get("channel/privateData", {
        params: {
          name: channel.name,
        },
      })
      .then((res) => {
        console.log("get infos channels");
        setInfosChannel(res.data);
        setChannelId(res.data.id);
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
    console.log("bbbbb");
  }

  return (
    <>
      <Button
        sx={{
          color: "black",
          ml: "1vh",
        }}
        onClick={(event) => {
          handleClick(props.channelData, event);
        }}
      >
        Infos
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
          <List key={channelId}>
            <ListItem>
              <ListItemText primary="Name" secondary={infosChannel.name} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Owner"
                secondary={infosChannel.owner.username}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Users"
                secondary={infosChannel.users.map((user: any) => user.username)}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Admins"
                secondary={infosChannel.admins.map(
                  (user: any) => user.username
                )}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Banned"
                secondary={infosChannel.banned.map(
                  (user: any) => user.username
                )}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Muted"
                secondary={infosChannel.muted.map((user: any) => user.username)}
              />
            </ListItem>
          </List>
        )}
      </Popover>
    </>
  );
}
