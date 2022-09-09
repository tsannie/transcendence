import { Box, Button, Grid, SvgIcon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { socket } from "../Chat";
import { IChannel } from "../types";
import LockSvg from "../../../assets/lock.svg";

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

  async function leaveChannel(channel: IChannel) {
    await api
      .post("channel/leaveChannel", channel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

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
        <Box>
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
          >
            {channelData.name}
          </Box>
          <Button onClick={() => joinChannel(channelData)}>Join</Button>
          <Button sx={{
            color: "red",
          }}
          onClick={() => leaveChannel(channelData)}>Leave</Button>
        </Box>
        );
      })}
    </Box>
  );
}
