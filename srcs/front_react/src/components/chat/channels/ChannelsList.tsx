import {
  Alert,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Popover,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../const/const";
import { IChannel } from "../types";
import { display } from "@mui/system";
import { LockIcon } from "./LockIcon";
import InfosChannels from "./InfosChannels";
import AdminsActions from "./admins/AdminsActions";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

interface ChannelsListProps {
  channelsList: IChannel[];
  userId: number
  getChannels: () => void
}

export default function ChannelsList(props: ChannelsListProps) {
  const [channelPassword, setChannelPassword] = useState("");
  const [channelExistsError, setChannelExistsError] = useState("");

  // function to know if userId is owner of channel with id maybe undefined
  function isOwner(id: number) {
    if (id === props.userId) {
      return true;
    }
    return false;
  }

  function joinNewChannelWithoutStatus(channel: IChannel) {
    if (channel.status === "Protected") {
      channel.password = channelPassword;
    }
    console.log(channel);

    const newChannel = {
      name: channel.name,
      password: channel.password,
    };
    console.log(newChannel);

    return newChannel;
  }

  async function joinChannel(channel: IChannel) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    await api
      .post("channel/joinChannel", newChannel)
      .then((res) => {
        console.log("channel joined with success");
        console.log(channel);
        props.getChannels();
      })
      .catch((res) => {
        console.log("invalid channels");
        // display response error
        console.log(res.response.data.message);
        setChannelExistsError(res.response.data.message);

        //console.log(res);
      });
    setChannelPassword("");
    setChannelExistsError("");
    // to do: refresh password after send (look send message)
  }

  async function leaveChannel(channel: IChannel) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    await api
      .post("channel/leaveChannel", newChannel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
        props.getChannels();
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  async function deleteChannel(channel: IChannel) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    await api
      .post("channel/deleteChannel", newChannel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
        props.getChannels();
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  return (
    <>
      {props.channelsList.map((channelData: IChannel) => {
        return (
          <Box
            sx={{
              color: "black",
              textAlign: "center",
              borderRadius: "3px",
              mb: "1vh",
              border: "1px solid black",
            }}
            key={channelData.name}
          >
            <Box sx={{ml: "1vw"}}>
              {channelData.name}
            </Box>
            <>{channelData.status === "Protected" ? <LockIcon /> : <></>}</>
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
            ></TextField>

            <Button
              sx={{
                ml: "1vh",
              }}
              // on click join channel if not already in
              onClick={() => {
                joinChannel(channelData);
              }}
            >
              {channelExistsError !== "" && (
                <Alert severity="error"> {channelExistsError}</Alert>
              )}
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
            {isOwner(channelData.owner.id) && (
              <Button
                sx={{
                  color: "red",
                  ml: "1vh",
                }}
                onClick={() => deleteChannel(channelData)}
              >
                Delete
              </Button>
            )}
            <AdminsActions
              channelData={channelData}
              userId={props.userId}
              isOwner={isOwner}
              getChannels={props.getChannels}
            />
            <InfosChannels channelData={channelData} userId={props.userId} />
          </Box>
        );
      })}
    </>
  );
}
