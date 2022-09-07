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
