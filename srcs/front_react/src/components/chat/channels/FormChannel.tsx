import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
//import { socket } from "../Chat";
import { IChannel, ICreateChannel } from "../types";
import { v4 as uuidv4 } from "uuid";
import ChannelsList from "./ChannelsList";
import { api, COOKIE_NAME } from "../../../const/const";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import { UserContext } from "../../../contexts/UserContext";

interface FormChannelProps {}

export default function FormChannel(props: FormChannelProps) {
  const [nameChannel, setNameChannel] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("Public");
  const [enablePassword, setEnablePassword] = useState(false);
  const [error, setError] = useState("");

  const { getChannelsUserlist, getAvailableChannels } =
    useContext(ChannelsContext);
  const { getUser } = useContext(UserContext);

  // create channel in db
  async function createChannels() {
    const channelData: Partial<ICreateChannel> = {
      name: nameChannel,
      status: status,
    };
    if (status === "Protected") {
      channelData.password = newPassword;
    }
    await api
      .post("channel/create", channelData)
      .then((res) => {
        console.log("channel created with success");
        console.log(channelData);
        getChannelsUserlist();
        getAvailableChannels();
        getUser();
      })
      .catch((res) => {
        console.log("error");
        console.log(res.response.data.message);
        setError(res.response.data.message[1]);
      });
    setError("");
  }

  return (
    <>
      <TextField
        variant="outlined"
        placeholder="name"
        onChange={(event) => {
          setNameChannel(event.target.value);
        }}
      ></TextField>
      {error !== "" && <Alert severity="error"> {error} </Alert>}
      <FormControl>
        <InputLabel id="channel-status">Status</InputLabel>
        <Select
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

      <Button variant="contained" onClick={createChannels}>
        Create channel
      </Button>
    </>
  );
}
