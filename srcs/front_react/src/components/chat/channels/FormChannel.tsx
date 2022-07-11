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

export default function FormChannel(props: any) {
  const [status, setStatus] = useState("Public");
  const [enablePassword, setEnablePassword] = useState(false);

  function createChannels() {
    console.log("createChannel");
    //socket.emit("createChannels");
  }

  return (
    <Box sx={{}}>
      <TextField sx={{}} variant="outlined" placeholder="name" />
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
            if (event.target.value === "Protected")
              setEnablePassword(true);
            else
              setEnablePassword(false);
          }}
        >
          <MenuItem value={"Public"}>Public</MenuItem>
          <MenuItem value={"Private"}>Private</MenuItem>
          <MenuItem value={"Protected"}>Protected</MenuItem>
        </Select>
      </FormControl>
      { enablePassword === true && <TextField variant="outlined" placeholder="password" /> }
      <Button sx={{}} variant="contained" onClick={createChannels}>
        Create channel
      </Button>
    </Box>
  );
}
