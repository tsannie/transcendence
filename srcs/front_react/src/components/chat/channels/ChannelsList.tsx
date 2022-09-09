import { Box, Button, Grid, SvgIcon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { socket } from "../Chat";
import { IChannel } from "../types";
import { display } from "@mui/system";
import { LockIcon } from "./LockIcon";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

// create state to hide/show password input


export default function ChannelsList() {
  const [channelsList, setChannelsList] = useState<Array<IChannel>>([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
          <Box
            sx={{
              width: "fit-content",
              height: "fit-content",
              color: "black",
              textAlign: "center",
              borderRadius: "3px",
              mb: "1vh",
              border: "1px solid black",
              display: "flex",
              alignItems: "center",
              }}
          >
            <Box
              sx={{
                height: "100%",
                ml: "1vh",
                color: "black",
                textAlign: "center",
              }}
              key={channelData.name}
            >
              {channelData.name}
            </Box>
            <Box>
              {channelData.status === "Protected" ? (
                <LockIcon /> ) : <div></div>
              }
            </Box>
            <Button
              sx={{
                ml: "1vh",
              }}
              onClick={() => joinChannel(channelData)}
            >
              Join
            </Button>
            <Button
              sx={{
                color: "red",
                ml: "1vh",
              }}
              onClick={() => leaveChannel(channelData)}
            >
              Leave
            </Button>
          </Box>
        );
      })}
    </Box>
  );
}
