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
import LockIcon from "@mui/icons-material/Lock";
import RefreshIcon from "@mui/icons-material/Refresh";
import { UserContext } from "../../../contexts/UserContext";

interface AvailableChannelsProps {}

export default function AvailableChannels(props: AvailableChannelsProps) {
  const [channelPassword, setChannelPassword] = useState("");

  const { getChannelsUserlist, getAvailableChannels, availableChannels } =
    useContext(ChannelsContext);
  const { userConnected } = useContext(UserContext);

  function isInChannel(channelId: number): boolean {
    for (
      let i = 0;
      userConnected.channels && i < userConnected.channels.length;
      i++
    ) {
      if (userConnected.channels[i].id === channelId) {
        return true;
      }
    }
    for (
      let i = 0;
      userConnected.owner_of && i < userConnected.owner_of.length;
      i++
    ) {
      if (userConnected.owner_of[i].id === channelId) {
        return true;
      }
    }
    return false;
  }

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
      .post("channel/join", newChannel)
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
      .post("channel/leave", newChannel)
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
    <List sx={{ border: "1px solid black" }}>
      Available Channels
      <IconButton onClick={() => getAvailableChannels()}>
        <RefreshIcon />
      </IconButton>
      {availableChannels.map((channel) => (
        <ListItem key={channel.name}>
          <ListItemText primary={channel.name} />

          {!isInChannel(channel.id) ? (
            <TextField
              sx={{
                minWidth: "15vw",
                display: channel.status === "Protected" ? "block" : "none",
                ml: 2,
              }}
              placeholder="password"
              type="password"
              value={channelPassword}
              onChange={(event) => {
                setChannelPassword(event.target.value);
              }}
            ></TextField>
          ) : (
            <ListItemIcon>
              {channel.status === "Protected" ? <LockIcon sx={{ ml: 1.5, maxHeight: 18, maxWidth: 18}} /> : <></>}
            </ListItemIcon>
          )}

          {!isInChannel(channel.id) ? (
            <ListItemButton
              onClick={() => {
                joinChannel(channel);
              }}
              sx={{ color: "green" }}
            >
              Join
            </ListItemButton>
          ) : (
            <ListItemButton
              onClick={() => {
                leaveChannel(channel);
              }}
              sx={{ color: "red" }}
            >
              Leave
            </ListItemButton>
          )}
        </ListItem>
      ))}
    </List>
  );
}
