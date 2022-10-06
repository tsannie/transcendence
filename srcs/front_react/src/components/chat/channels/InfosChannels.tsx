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
  channelData: any;
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [channelId, setChannelId] = useState(0);

  function handleClick() {
    console.log("click on user who i wnat to ban, mute etc");
  }

  return (
    <Grid container>
      <Grid item>
        <List>
          <ListItem>
            <ListItemButton key={props.channelData.name}
              onClick={handleClick}
            >
              <ListItemText>{props.channelData.owner.username}</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>

      {/* <Grid item>
        <List>
          {props.channelData.data.admins.map((user) => (
            <ListItem>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid item>
        <List>
          {props.channelData.data.users.map((user) => (
            <ListItem>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      </Grid> */}
    </Grid>
  );
}
