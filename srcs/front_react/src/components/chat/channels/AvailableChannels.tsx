import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import { IChannel } from "../types";
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from "@mui/icons-material/Refresh";

interface AvailableChannelsProps {}

export default function AvailableChannels(props: AvailableChannelsProps) {
  const [channelPassword, setChannelPassword] = useState("");

  const { getChannelsUserlist, getAvailableChannels, availableChannels } = useContext(ChannelsContext);

  function joinNewChannelWithoutStatus(channel: IChannel) {
    if (channel.status === "Protected") {
      channel.password = channelPassword;
    }
    console.log(channel);

    const newChannel = {
      name: channel.name,
      password: channel.password,
    };
    console.log(newChannel);

    return newChannel;
  }

  async function joinChannel(channel: IChannel) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    await api
      .post("channel/joinChannel", newChannel)
      .then((res) => {
        console.log("channel joined with success");
        console.log(channel);
        //console.log("list channels =", channelsList);
        getChannelsUserlist();
        getAvailableChannels();
      })
      .catch((res) => {
        console.log("invalid channels");
        // display response error
        console.log(res.response.data.message);
        //setChannelExistsError(res.response.data.message);
      });
    setChannelPassword("");
    //setChannelExistsError("");
    // to do: refresh password after send (look send message)
  }

  async function leaveChannel(channel: IChannel) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    await api
      .post("channel/leaveChannel", newChannel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
        getChannelsUserlist();
        getAvailableChannels();
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  useEffect(() => {
    getAvailableChannels();
  }, []);

  return (
    <List sx={{ border: "1px solid black"}}>
      Available Channels
      <IconButton onClick={() => getAvailableChannels()}>
        <RefreshIcon />
      </IconButton>
      {availableChannels.map((channel) => (
        <ListItem key={channel.name}>
          <ListItemText primary={channel.name} />
          <ListItemIcon>
            {channel.status === "Protected" ? <LockIcon /> : <></>}
          </ListItemIcon>
            <TextField
              sx={{
                minWidth: "15vw",
                display: channel.status === "Protected" ? "block" : "none",
              }}
              placeholder="password"
              type="password"
              onChange={(event) => {
                setChannelPassword(event.target.value);
              }}
            ></TextField>
            <ListItemButton
              onClick={() => {
                joinChannel(channel);
              }}
              sx={{ color: "green" }}
            >
              Join
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                leaveChannel(channel);
              }}
              sx={{ color: "red" }}
            >
              Leave
            </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
