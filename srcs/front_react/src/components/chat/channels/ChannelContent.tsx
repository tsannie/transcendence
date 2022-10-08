import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import Conv from "../messages/Conv";
import MessagesList from "../messages/MessagesList";
import { IChannel } from "../types";
import AdminsActions from "./admins/AdminsActions";
import InfosChannels from "./InfosChannels";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import { MessagesContext } from "../../../contexts/MessagesContext";
import { UserContext } from "../../../contexts/UserContext";

interface ChannelContentProps {
  isOpenInfos: boolean;
  //messagesList: any[];
  //setMessagesList: (messagesList: any[]) => void;
 // username: string;
  //setCurrentMessage: (message: string) => void;
  //sendMessage: () => void;
}

export default function ChannelContent(props: ChannelContentProps) {
  const [openMoreInfos, setOpenMoreInfos] = useState(false);
  const { getChannelsUserlist, channelData } = useContext(ChannelsContext);

  function handleClick(event: any) {
    console.log("more infos");
    setOpenMoreInfos(!openMoreInfos);
  }

  function joinNewChannelWithoutStatus(channel: any) {
    const newChannel = {
      name: channel.data.name,
    };
    console.log(newChannel);

    return newChannel;
  }

  async function deleteChannel(channel: any) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    console.log(channel);
    await api
      .post("channel/deleteChannel", newChannel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
        getChannelsUserlist();
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  console.log("channel data", channelData);
  console.log("isopeninfos", props.isOpenInfos);
  return (
    <Grid container>
      {channelData.status !== "publicUser" && (
        <Grid item xs={9}>
          <Box sx={{ border: "3px solid red" }}>
            <Grid item>
              <Typography variant={"h4"}>{channelData.name}</Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>
                {channelData.data.createdAt}
              </Typography>
            </Grid>
            {channelData.status === "owner" && (
              <Grid item>
                <IconButton onClick={handleClick}>
                  <MoreHorizIcon />
                </IconButton>
                {openMoreInfos && (
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
              </Grid>
            )}
          </Box>
          <Conv
            //messagesList={props.messagesList}
            //setMessagesList={props.setMessagesList}
            //username={props.username}
            //setCurrentMessage={props.setCurrentMessage}
            //sendMessage={props.sendMessage}
          />
        </Grid>
      )}
      <Grid item xs={3}>
        <InfosChannels
          //channelData={channelData}
          //username={props.username}
        />
      </Grid>
    </Grid>
  );
}
