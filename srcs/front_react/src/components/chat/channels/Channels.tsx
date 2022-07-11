import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Add from "../../../assets/add.png";
import FormChannel from "./FormChannel";

export default function Channels(props: any) {
  const [newChannel, setNewChannel] = useState(false);
  function setChannel() {
    setNewChannel(true);
  }

  return (
    <Box
      sx={{
        position: "absolute",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
        }}
        variant="h5"
      >
        Channels
      </Typography>
      <img src={Add} onClick={setChannel}></img>
      {newChannel === true && <FormChannel />}
    </Box>
  );
}
