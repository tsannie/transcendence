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
import { SnackbarContext, SnackbarContextType } from "../../../contexts/SnackbarContext";

interface AvailableChannelsProps { }

export default function AvailableChannels(props: AvailableChannelsProps) {
  const [channelPassword, setChannelPassword] = useState("");

  const { getChannelsUserlist, getAvailableChannels, availableChannels } =
    useContext(ChannelsContext);
  const { userConnected, getUser } = useContext(UserContext);
  const { setMessage, setOpenSnackbar, setSeverity } = useContext(SnackbarContext) as SnackbarContextType;

  function isInChannel(channelId: number): boolean {

    if (userConnected.channels) {
      for (const channel of userConnected.channels) {
        if (channel.id === channelId) {
          return true;
        }
      }
    }

    if (userConnected.owner_of) {
      for (const owner of userConnected.owner_of) {
        if (owner.id === channelId) {
          return true;
        }
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
        setSeverity("success");
        setMessage("channel joined");
        setOpenSnackbar(true);
        getChannelsUserlist();
        getAvailableChannels();
        getUser();
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res.response.data.message);
        setSeverity("error");
        setMessage(res.response.data.message);
        setOpenSnackbar(true);
      });
    setChannelPassword("");
  }

  async function leaveChannel(channel: IChannel) {
    await api
      .post("channel/leave", channel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
        setSeverity("success");
        setMessage("channel left");
        setOpenSnackbar(true);
        getChannelsUserlist();
        getAvailableChannels();
        getUser();
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
        setSeverity("error");
        setMessage(res.response.data.message);
        setOpenSnackbar(true);
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
              {channel.status === "Protected" ? (
                <LockIcon sx={{ ml: 1.5, maxHeight: 18, maxWidth: 18 }} />
              ) : (
                <></>
              )}
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
