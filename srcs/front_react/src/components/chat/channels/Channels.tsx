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
  const [isOwner, setIsOwner] = useState(false);

  function setChannel() {
    if (!newChannel) setNewChannel(true);
    else setNewChannel(false);
  }

  // get all channels
  async function getChannels() {
    //console.log(channelCreated);
    console.log("get channels");
    await api
      .get("channel/all")
      .then((res) => {
        setChannelsList(res.data);

        // check if user is owner of channel
        res.data.forEach((channel: any) => {
          // get all users
          channel.users.forEach((user: any) => {
            if (channel.owner.id === user.id) {
              setIsOwner(true);
            }
          });
        });
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
          setIsOwner={setIsOwner}
          getChannels={getChannels}
        />
      )}
      <ChannelsList channelsList={channelsList} isOwner={isOwner} />
    </Box>
  );
}
