import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import { IChannel } from "../types";

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
