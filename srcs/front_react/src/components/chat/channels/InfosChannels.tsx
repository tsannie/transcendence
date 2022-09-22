import { Button, List, ListItem, ListItemText, Popover } from "@mui/material";
import React, { useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { IChannel } from "../types";

export default function InfosChannels(props: any) {
  const [infosChannel, setInfosChannel] = useState({});
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
    console.log("bbbbb");
  }

  return (
    <div>
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
          <List>
            {Object.entries(infosChannel).map(([key, value]) => {
              if (typeof value === "string") {
                return (
                  <ListItem key={key}>
                    <ListItemText primary={key} secondary={value} />
                  </ListItem>
                );
              } else if (typeof value === "object" && value !== null) {
                return (
                  <ListItem key={key}>
                    <ListItemText
                      primary={key}
                      secondary={Object.entries(value).map(
                        ([key, childValue]) => {
                          if (key === "username") {
                            return <div key={key}>{childValue}</div>;
                          }
                        }
                      )}
                    />
                  </ListItem>
                );
              }
            })}
          </List>
        )}
      </Popover>
    </div>
  );
}