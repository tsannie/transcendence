import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../const/const";
import { IChannel } from "../types";
import AdminsActions from "./admins/AdminsActions";

interface InfosChannelsProps {
  username: string;
  channelData: any;
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [channelId, setChannelId] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function handleClick(event: any) {
    console.log("click on user who i wnat to ban, mute etc");
    setAnchorEl(event.currentTarget);
    console.log("channel", props.channelData);
    //props.getChannels();
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <Grid container>
      <Grid item>
        <List>
          Owner
          <ListItem>
            <ListItemButton key={props.channelData.data.name}
              onClick={handleClick}
            >
             {<ListItemText>{props.channelData.data.owner.username}</ListItemText> }
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>

      { props.channelData.status !== "publicUser" && <Grid item>
        <List>
          Admins
          {props.channelData.data.admins.map((user: any) => (
            <ListItemButton key={user.username}
              onClick={handleClick}
              disabled={props.channelData.status !== "owner"}
            >
              <ListItemText primary={user.username} />
              <AdminsActions
                id={id}
                open={open}
                anchorEl={anchorEl}
                handleClose={handleClose}
                channelData={props.channelData}
              />
            </ListItemButton>
          ))}
        </List>
      </Grid>
      }

      <Grid item>
        <List>
          Users
          {props.channelData.data.users.map((user: any) => (
            <ListItemButton key={user.username}
              onClick={handleClick}
              disabled={props.channelData.status !== "owner" && props.channelData.status !== "admin"}
            >
              <ListItemText primary={user.username} />
            </ListItemButton>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
