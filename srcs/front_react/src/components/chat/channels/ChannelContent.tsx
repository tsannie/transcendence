import { Button, Grid, IconButton, ListItemButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import Conv from "../messages/Conv";
import MessagesList from "../messages/MessagesList";
import { IChannel } from "../types";
import AdminsActions from "./admins/AdminsActions";
import InfosChannels from "./InfosChannels";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import { MessagesContext } from "../../../contexts/MessagesContext";
import ChannelMoreInfos from "./ChannelMoreInfos";
import { SnackbarContext, SnackbarContextType } from "../../../contexts/SnackbarContext";

interface ChannelContentProps {
  getChannelDatas: any;
  channelData: any;
}

export default function ChannelContent(props: ChannelContentProps) {

  const { getChannelsUserlist } = useContext(ChannelsContext);
  const { setMessage, setOpenSnackbar, setSeverity } = useContext(SnackbarContext) as SnackbarContextType;

  async function leaveChannel(channelName: string) {
    const newChannel = {
      name: channelName,
    }
    await api
      .post("channel/leave", newChannel)
      .then((res) => {
        console.log("channel left with success");
        //console.log(channel);
        getChannelsUserlist();
        setSeverity("success");
        setMessage("channel left");
        setOpenSnackbar(true);
        //getAvailableChannels();
        //getUser();
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
        setSeverity("error");
        setMessage(res.response.data.message);
        setOpenSnackbar(true);
      });
  }

  if (props.channelData !== undefined) {
    return (
      <Grid container>
        {props.channelData.status !== "public" && (
          <Grid item xs={9}>
            <Box sx={{ border: "3px solid red" }}>
              <Grid item>
                <Typography variant={"h6"}>
                  {"Channel " + props.channelData.data.name}
                </Typography>
                <Typography variant={"h6"}>
                  {"Created the " + props.channelData.data.createdAt}
                </Typography>
                {props.channelData.status === "owner" && (
                  <ChannelMoreInfos
                    channelData={props.channelData}
                    getChannelDatas={props.getChannelDatas}
                  />
                )}
                <Button
                  onClick={() => leaveChannel(props.channelData.data.name)}
                  sx={{
                    //float: "right",
                  }}
                >
                  Leave Channel
                </Button>
              </Grid>
            </Box>
            <Conv />
          </Grid>
        )}
        <Grid item xs={3}>
          <InfosChannels
            getChannelDatas={props.getChannelDatas}
            channelData={props.channelData}
          />
        </Grid>
      </Grid>
    );
  }
  return <></>;
}
