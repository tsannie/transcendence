import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { socket } from "../Chat";
import { IChannel } from "../types";
import { v4 as uuidv4 } from "uuid";
import { api } from "../../../userlist/UserListItem";
import ChannelsList from "./ChannelsList";

export default function FormChannel(props: any) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Public");
  const [enablePassword, setEnablePassword] = useState(false);

  async function createChannels() {
    let endingFct = false;

    await api
      .get("channel/all")
      .then((res) => {
        const ChannelById = res.data.filter((channel: IChannel) => {
          return channel.id === name;
        });
        if (ChannelById.length !== 0 && name !== "") {
          alert("id deja pris");
          endingFct = true;
        }
      })
      .catch((res) => {
        console.log("error");
        console.log(res);
      });

    if (endingFct)
      return ;
    if (name !== "") {
      const channelData: IChannel = {
        id: name,
        status: status,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, "0"),
      };
      socket.emit("createChannel", channelData);
      props.setChannelCreated(true);
      props.setNewChannel(false);
    }
  }

  return (
    <Box sx={{}}>
      <TextField
        sx={{}}
        variant="outlined"
        placeholder="name"
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
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
