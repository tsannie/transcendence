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

interface InfosChannelsProps {
  username: string;
  channelData: any;
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [channelId, setChannelId] = useState(0);

  function handleClick() {
    console.log("click on user who i wnat to ban, mute etc");
    console.log("channel", props.channelData);
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

      <Grid item>
        <List>
          Admins
          {props.channelData.data.admins.map((user: any) => (
            <ListItemButton key={user.username}
              onClick={handleClick}
            >
              <ListItemText primary={user.username} />
            </ListItemButton>
          ))}
        </List>
      </Grid>

      <Grid item>
        <List>
          Users
          {props.channelData.data.users.map((user: any) => (
            <ListItemButton key={user.username}
              onClick={handleClick}
              disabled={props.username !== props.channelData.data.owner.username}
            >
              <ListItemText primary={user.username} />
            </ListItemButton>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
