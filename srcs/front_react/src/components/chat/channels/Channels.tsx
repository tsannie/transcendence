import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Add from "../../../assets/add.png";
import { socket } from "../Chat";
import FormChannel from "./FormChannel";

export default function Channels(props: any) {
  const [newChannel, setNewChannel] = useState(false);
  function createChannels() {
    console.log("hello");
    socket.emit("createChannels");
    setNewChannel(true);
  }

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box>
        <img src={Add} onClick={createChannels}></img>
        {newChannel === true && <FormChannel />}
      </Box>
    </Box>
  );
}
