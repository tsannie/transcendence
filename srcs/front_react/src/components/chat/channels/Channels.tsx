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
  setEnumState: (enumState: ChatContent) => void;
  channelsList: IChannel[];
  setChannelsList: (channelsList: IChannel[]) => void;
}

export default function Channels(props: ChannelProps) {
  const [userId, setUserId] = useState(0);

  function setChannel() {
    props.setEnumState(ChatContent.NEW_CHANNELS);
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
        props.setChannelsList(res.data);
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
      <ChannelsList channelsList={props.channelsList} userId={userId} getChannels={getChannels} />
    </Box>
  );
}
