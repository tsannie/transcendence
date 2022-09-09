import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { socket } from "../Chat";
import { IChannel } from "../types";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

export default function ChannelsList() {

  const [channelsList, setChannelsList] = useState<Array<IChannel>>([]);

  // get all channels
  function getChannels() {
    api
      .get("channel/all")
      .then((res) => {
        setChannelsList(res.data);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  // call getChannels() when channelList change
  useEffect(() => {
    getChannels();
  }, [channelsList]);

  return (
    <Box>
      {channelsList.map((channelData: IChannel) => {
        return (
          <Box
            sx={{
              color: "red",
            }}
            key={channelData.name}
          >
            {channelData.name}
          </Box>
        );
      })}
    </Box>
  );
}