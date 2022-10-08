import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import Add from "../../../assets/add.png";
import { IChannel } from "../types";
import ChannelsList from "./ChannelsList";
import FormChannel from "./FormChannel";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ChatContent } from "../Chat";
import { api } from "../../../const/const";
import { Channel } from "diagnostics_channel";
import { ChannelsContext } from "../../../contexts/ChannelsContext";

interface ChannelProps {
  setIsOpenInfos: (isOpenInfos: boolean) => void;
  setChatContent: (chatContent: ChatContent) => void;
}

export default function Channels(props: ChannelProps) {

  const { getChannelsUserlist } = useContext(ChannelsContext);

  function setChannel() {
    props.setChatContent(ChatContent.NEW_CHANNELS);
  }

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
      <IconButton onClick={() => getChannelsUserlist()}>
        <RefreshIcon />
      </IconButton>
      <IconButton onClick={setChannel}>
        <AddIcon sx={{ color: "blue" }} />
      </IconButton>
      <ChannelsList
        setIsOpenInfos={props.setIsOpenInfos}
        setChatContent={props.setChatContent}
      />
    </Box>
  );
}
