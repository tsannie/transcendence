import { Box, Button, Grid, SvgIcon, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../userlist/UserListItem";
//import { socket } from "../Chat";
import { IChannel } from "../types";
import { display } from "@mui/system";
import { LockIcon } from "./LockIcon";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

export default function ChannelsList() {
  const [channelsList, setChannelsList] = useState<Array<IChannel>>([]);
  const [channelPassword, setChannelPassword] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  function createNewChannelWithoutStatus(channel: IChannel) {

    if (channel.status === "Protected") {
      channel.password = channelPassword;
    }
    console.log(channel);

    const newChannel = {
      name: channel.name,
      password: channel.password,
    }
    console.log(newChannel);

    return (newChannel);
  }

  async function joinChannel(channel: IChannel) {
    const newChannel = createNewChannelWithoutStatus(channel);

    await api
      .post("channel/joinChannel", newChannel)
      .then((res) => {
        console.log("channel joined with success");
        console.log(channel);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
    setChannelPassword("")
    // to do: refresh password after send (look send message)
  }

  async function leaveChannel(channel: IChannel) {
    const newChannel = createNewChannelWithoutStatus(channel);

    await api
      .post("channel/leaveChannel", newChannel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  async function deleteChannel(channel: IChannel) {
    const newChannel = createNewChannelWithoutStatus(channel);

    await api
      .post("channel/deleteChannel", newChannel)
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
  async function getChannels() {
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
        })
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
              {channelData.status === "Protected" ? <LockIcon /> : <div></div>}
            </Box>
            <TextField
                sx={{
                  minWidth: "15vw",
                  display: channelData.status === "Protected" ? "block" : "none",
                }}
                placeholder="password"
                type="password"
                onChange={(event) => {
                  setChannelPassword(event.target.value);
                }}
              >
            </TextField>
            <Button
              sx={{
                ml: "1vh",
              }}
              // on click join channel if not already in
              onClick={() => {
                joinChannel(channelData);
              }}
            >
              Join
            </Button>
            <Button
              sx={{
                color: "green",
                ml: "1vh",
              }}
              onClick={() => leaveChannel(channelData)}
            >
              Leave
            </Button>
            {isOwner && <Button
              sx={{
                color: "red",
                ml: "1vh",
              }}
              onClick={() => deleteChannel(channelData)}
            >
              Delete
            </Button> }
          </Box>
        );
      })}
    </Box>
  );
}
