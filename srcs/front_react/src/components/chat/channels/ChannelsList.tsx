import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { socket } from "../Chat";
import { IChannel } from "../types";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

export default function ChannelsList() {
  const [channelsList, setChannelsList] = useState<Array<IChannel>>([]);

  async function joinChannel(channel: IChannel) {
    await api
      .post("channel/joinChannel", channel)
      .then((res) => {
        console.log("channel joined with success");
        console.log(channel);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  function leaveChannel(channel: IChannel) {}

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
              width: "100%",
              height: "100%",
              color: "black",
              textAlign: "center",
              border: "1px solid black",
              borderRadius: "3px",
              mb: "1vh",
            }}
            key={channelData.name}
            onClick={() => joinChannel(channelData)}
          >
            {channelData.name}
            <Box>
              {channelData.status === "Protected" ? <div> Protected channel</div> : <Box></Box>}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
