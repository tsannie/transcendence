import { Button, List, ListItem, ListItemText, Popover } from "@mui/material";
import React, { useState } from "react";
import { api } from "../../../userlist/UserList";
import { IChannel } from "../types";

interface InfosChannelsProps {
  channelData: IChannel;
  userId: number;
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [infosChannel, setInfosChannel] = useState({});
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [channelId, setChannelId] = useState(0);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // check if user is admin of the channel in infosChannel
  function isAdmin(channel: any, id: number) {
    if (infosChannel === undefined)
      getInfosChannel(channel);
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
          <List
            key={channelId}
          >
            {Object.entries(infosChannel).map(([key, value]) => {
              if (typeof value === "string" && key !== "password") {
                return (
                  <ListItem key={key}>
                    <ListItemText primary={key} secondary={value} />
                  </ListItem>
                );
              } else if (typeof value === "object" && value !== null) {
                if ((key === "banned" && isAdmin(infosChannel, props.userId)) || key !== "banned") {
                  return (
                    <ListItem key={key}>
                      {Object.entries(value).map(([childKey, childValue]) => {
                        if (childKey === "username") {
                          return (
                            <ListItemText
                              primary={key}
                              secondary={childValue}
                            />
                          );
                        }
                      })}
                    </ListItem>
                  );
                }
              }
            })}
          </List>
        )}
      </Popover>
    </>
  );
}
