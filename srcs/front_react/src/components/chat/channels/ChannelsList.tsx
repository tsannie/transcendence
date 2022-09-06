import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { IChannel } from "../types";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

async function DisplayChannels() {
    await api.get('channel/all').then(res => {
      console.log(res.data);
      //setId(res.data.id);
      //setUsername(res.data.username);
      //setEmail(res.data.email);
    }).catch(res => {
      console.log('invalid channels');
      console.log(res)
    });
}

export default function ChannelsList(props: any) {
  if (props.channelCreated === true)
    return (
      <Box
        sx={{
          width: "fit-content",
          height: "fit-content",
          backgroundColor: "#064fbd",
          color: "white",
          fontFamily: "sans-serif",
          fontSize: 16,
          borderRadius: 12,
          ml: "auto",
          mr: 0.5,
          mb: 1,
          p: 1,
        }}
        key={props.channelData.id}
      >
        {props.channelData.content}
      </Box>
    );
}
