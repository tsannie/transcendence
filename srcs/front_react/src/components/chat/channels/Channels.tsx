import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Add from "../../../assets/add.png";
import ChannelsList from "./ChannelsList";
import FormChannel from "./FormChannel";

export default function Channels(props: any) {
  const [newChannel, setNewChannel] = useState(false);
  const [channelCreated, setChannelCreated] = useState(false);

  function setChannel() {
    if (!newChannel)
      setNewChannel(true);
    else
      setNewChannel(false);
  }


  return (
    <Box
      sx={{
        position: "absolute",
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
      <img src={Add} onClick={setChannel}></img>
      {newChannel === true && (
        <FormChannel
          setNewChannel={setNewChannel}
          setChannelCreated={setChannelCreated}
        />
      )}
      <ChannelsList />
    </Box>
  );
}
