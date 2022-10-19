import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
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
import { UserContext } from "../../../contexts/UserContext";
import ChannelMoreInfos from "./ChannelMoreInfos";

interface ChannelContentProps {
  getChannelDatas: any;
  channelData: any;
}

export default function ChannelContent(props: ChannelContentProps) {

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
              </Grid>
              {props.channelData.status === "owner" && (
                <ChannelMoreInfos
                  channelData={props.channelData}
                  getChannelDatas={props.getChannelDatas}
                />
              )}
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
