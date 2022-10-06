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
  channelData: IChannel;
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [infosChannel, setInfosChannel] = useState<IChannel>(props.channelData);
  const [channelId, setChannelId] = useState(0);

  function handleClick() {
    console.log("click on user who i wnat to ban, mute etc");
  }

  async function getInfosChannel(channel: IChannel) {
    await api
      .get("channel/datas", {
        params: {
          name: channel.name,
        },
      })
      .then((res) => {
        console.log("get infos channels");
        setInfosChannel(res.data);
        setChannelId(res.data.id);
        console.log(res.data);
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
    console.log("bbbbb");
  }

  useEffect(() => {
    getInfosChannel(props.channelData);
  }, []);

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
          {infosChannel.admins.map((user) => (
            <ListItem>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid item>
        <List>
          {infosChannel.users.map((user) => (
            <ListItem>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      </Grid> */}
    </Grid>
  );
}
