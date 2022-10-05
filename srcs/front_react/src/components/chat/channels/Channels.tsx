import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Add from "../../../assets/add.png";
import { IChannel } from "../types";
import ChannelsList from "./ChannelsList";
import FormChannel from "./FormChannel";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ChatContent } from "../Chat";
import { api } from "../../../const/const";

interface ChannelProps {
  setChatContent: (chatContent: ChatContent) => void;
}

export default function Channels(props: ChannelProps) {
  const [channelsList, setChannelsList] = useState<IChannel[]>([]);

  function setChannel() {
    props.setChatContent(ChatContent.NEW_CHANNELS);
  }

  // get all channels
  async function getChannels() {

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
  }, []);

  return (
    <Box sx={{ border: "1px solid black", width: "100%" }}>
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
      <ChannelsList channelsList={channelsList} getChannels={getChannels} />
    </Box>
  );
}
