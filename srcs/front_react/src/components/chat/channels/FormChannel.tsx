import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { socket } from "../Chat";
import { IChannel } from "../types";
import { v4 as uuidv4 } from "uuid";

export default function FormChannel(props: any) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Public");
  const [enablePassword, setEnablePassword] = useState(false);

  function createChannels() {
    console.log("createChannel");
    const channelData: IChannel = {
      id: name,
      status: status,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        String(new Date(Date.now()).getMinutes()).padStart(2, "0"),
    };
    socket.emit("createChannel", channelData);
  }

  return (
    <Box sx={{}}>
      <TextField sx={{}} variant="outlined" placeholder="name"
      onChange={(event) => {
          setName(event.target.value);
        }}/>
      <FormControl>
        <InputLabel id="channel-status">Status</InputLabel>
        <Select
          sx={{
            width: "fit-content",
          }}
          labelId="channel-status"
          id="channel-status-select"
          value={status}
          label="Status"
          onChange={(event) => {
            setStatus(event.target.value);
            if (event.target.value === "Protected") {
              setEnablePassword(true);
            } else {
              setEnablePassword(false);
            }
          }}
        >
          <MenuItem value={"Public"}>Public</MenuItem>
          <MenuItem value={"Private"}>Private</MenuItem>
          <MenuItem value={"Protected"}>Protected</MenuItem>
        </Select>
      </FormControl>
      {enablePassword === true && (
        <TextField variant="outlined" placeholder="password" />
      )}
      <Button sx={{}} variant="contained" onClick={createChannels}>
        Create channel
      </Button>
    </Box>
  );
}
