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
//import { socket } from "../Chat";
import { IChannel, ICreateChannel } from "../types";
import { v4 as uuidv4 } from "uuid";
import ChannelsList from "./ChannelsList";
import { api, COOKIE_NAME } from "../../../const/const";

interface FormChannelProps {
  getChannelsUserlist: () => void;
}

export default function FormChannel(props: FormChannelProps) {
  const [nameChannel, setNameChannel] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("Public");
  const [enablePassword, setEnablePassword] = useState(false);

  // create channel in db
  async function createChannels() {
    const channelData: ICreateChannel = {
      name: nameChannel,
      status: status,
    };
    if (status === "Protected") {
      channelData.password = newPassword;
    }
    api
      .post("channel/createChannel", channelData)
      .then((res) => {
        console.log("channel created with success");
        console.log(channelData);
        props.getChannelsUserlist();
        //props.getAvailableChannels();
      })
      .catch((res) => {
        console.log("error");
        console.log(res.response.data.message);
      });
  }

  return (
    <>
      <TextField
        sx={{}}
        variant="outlined"
        placeholder="name"
        onChange={(event) => {
          setNameChannel(event.target.value);
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
      {enablePassword && (
        <TextField
          variant="outlined"
          placeholder="password"
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
        />
      )}
      <Button sx={{}} variant="contained" onClick={createChannels}>
        Create channel
      </Button>
    </>
  );
}
