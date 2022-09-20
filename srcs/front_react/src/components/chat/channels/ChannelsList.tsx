import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../const/const";
import { socket } from "../Chat";
import { IChannel } from "../types";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

export default function ChannelsList() {

  const [channelsList, setChannelsList] = useState<Array<IChannel>>([]);

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

  useEffect(() => {
    const strChannelsList = JSON.parse(window.localStorage.getItem("channelsList") || "null");
    setChannelsList(strChannelsList);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("channelsList", JSON.stringify(channelsList));
  }, [channelsList]);

  // a changer (rq api en boucle)

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
