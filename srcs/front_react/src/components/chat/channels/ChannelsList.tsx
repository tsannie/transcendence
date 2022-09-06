import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { socket } from "../Chat";
import { IChannel } from "../types";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

export default function ChannelsList(props: any) {

  let i = 0;
  const [channelsList, setChannelsList] = useState<Array<IChannel>>([]);

  console.log("danschannellist")

  function getChannels() {
    api
      .get("channel/all")
      .then((res) => {
        console.log(res.data);
        setChannelsList(res.data);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  console.log(props.channelCreated);

  useEffect(() => {
    const strChannelsList = JSON.parse(window.localStorage.getItem("channelsList") || "null");
    setChannelsList(strChannelsList);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("channelsList", JSON.stringify(channelsList));
  }, [channelsList]);

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
            key={channelData.id}
          >
            {channelData.id}
          </Box>
        );
      })}
    </Box>
  );
}
