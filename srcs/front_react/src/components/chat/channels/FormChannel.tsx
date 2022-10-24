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
import ChannelsList from "./ChannelsList";
import { api, COOKIE_NAME } from "../../../const/const";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import { SnackbarContext, SnackbarContextType } from "../../../contexts/SnackbarContext";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";

interface FormChannelProps { }

export default function FormChannel(props: FormChannelProps) {
  const [nameChannel, setNameChannel] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("Public");
  const [enablePassword, setEnablePassword] = useState(false);
  const { setMessage, setOpenSnackbar, setSeverity } = useContext(SnackbarContext) as SnackbarContextType;

  const { getChannelsUserlist, getAvailableChannels } =
    useContext(ChannelsContext);
  const { getUser } = useContext(AuthContext) as AuthContextType;

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
        setSeverity("success");
        setMessage("channel created");
        setOpenSnackbar(true);
        console.log(channelData);
        getChannelsUserlist();
        getAvailableChannels();
        getUser();
      })
      .catch((res) => {
        console.log("error");
        console.log(res.response.data.message);
        setSeverity("error");
        if (typeof (res.response.data.message) !== "string") {
          setMessage(res.response.data.message[0]);
        }
        else {
          setMessage(res.response.data.message);
        }
        setOpenSnackbar(true);
      });
    setNewPassword("");
    setNameChannel("");
  }

  return (
    <>
      <TextField
        variant="outlined"
        placeholder="name"
        value={nameChannel}
        onChange={(event) => {
          setNameChannel(event.target.value);
        }}
      ></TextField>
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
          type="password"
          // reset input password when msg is sent
          value={newPassword}
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
