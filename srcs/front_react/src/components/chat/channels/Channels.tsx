import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Add from "../../../assets/add.png";
import { api } from "../../../userlist/UserListItem";
import { IChannel } from "../types";
import ChannelsList from "./ChannelsList";
import FormChannel from "./FormChannel";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Channels(props: any) {
  const [newChannel, setNewChannel] = useState(false);
  const [channelCreated, setChannelCreated] = useState(false);
  const [channelsList, setChannelsList] = useState<Array<IChannel>>([]);
  const [userId, setUserId] = useState(0);

  function setChannel() {
    if (!newChannel) setNewChannel(true);
    else setNewChannel(false);
  }

  // get all channels
  async function getChannels() {
    // get auth profile and put it in user variable
    await api.get("auth/profile").then((res) => {
      //console.log(res.data);
      //console.log(res.data.id);
      setUserId(res.data.id);
    });

    //console.log(channelCreated);
    console.log("get channels");
    await api
      .get("channel/all")
      .then((res) => {
        setChannelsList(res.data);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  // get all channels
  useEffect(() => {
    getChannels();
  }, [channelCreated]);

  return (
    <Box
      sx={{
        position: "absolute",
        border: "1px solid green",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
        }}
        variant="h5"
      >
        Channels
      </Typography>
      <IconButton onClick={() => getChannels()}>
        <RefreshIcon />
      </IconButton>

      <IconButton onClick={setChannel}>
        <AddIcon sx={{ color: "blue" }} />
      </IconButton>
      {newChannel && (
        <FormChannel
          setNewChannel={setNewChannel}
          setChannelCreated={setChannelCreated}
          setChannelsList={setChannelsList}
          getChannels={getChannels}
        />
      )}
      <ChannelsList channelsList={channelsList} userId={userId} getChannels={getChannels} />
    </Box>
  );
}
