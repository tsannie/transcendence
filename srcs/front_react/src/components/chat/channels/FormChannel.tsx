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
import { COOKIE_NAME } from "../../../const";

export default function FormChannel(props: any) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("Public");
  const [enablePassword, setEnablePassword] = useState(false);
  const [ownerid, setOwnerid] = useState("");

<<<<<<< HEAD
<<<<<<< HEAD
  async function getUser() {
    if (document.cookie.includes(COOKIE_NAME)) {
      await api
        .get("auth/profile")
        .then((res) => {
          console.log(res.data.username);
          setOwnerid(res.data.username);
        })
        .catch((res) => {
          console.log("invalid jwt");
          console.log(res);
          document.cookie = COOKIE_NAME + "=; Max-Age=-1;;";
        });
    }
  }

  // check if channel name is already taken in db
  async function checkChannelName(name: string) {
    let isTaken = false;
    await api
      .get("channel/all")
      .then((res) => {
        res.data.forEach((channel: IChannel) => {
          if (channel.name === name) {
            isTaken = true;
          }
=======
  async function createChannels() {
    let endingFct = false;
    let allExistingChannels: Array<IChannel>;
=======
  async function getUser() {
    if (document.cookie.includes(COOKIE_NAME))
    {
      await api.get('auth/profile').then(res => {
        console.log(res.data.username)
        setOwnerid(res.data.username);
      }).catch(res => {
        console.log('invalid jwt');
        console.log(res);
        document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
      });
    }
  }
>>>>>>> [+] change createChannel from socket to req api

  function checkifchannelexist(): boolean {
    api
      .get("channel/all")
      .then((res) => {
<<<<<<< HEAD
        console.log(res.data);
        allExistingChannels = res.data;
        const ChannelById = allExistingChannels.filter((channel) => {
          return channel.id === name;
>>>>>>> [fix] fix cookies and state for login/logout
        });
=======
        const ChannelById = res.data.filter((channel: IChannel) => {
          return channel.name === username;
        });
        if (ChannelById.length !== 0 && username !== "") {
          alert("id deja pris");
          return (true);
        }
>>>>>>> [+] change createChannel from socket to req api
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
<<<<<<< HEAD
    return isTaken;
  }

  async function createChannels() {
    await checkChannelName(username).then((isTaken) => {
      if (isTaken) {
        alert("Channel name already taken");
      } else {
        if (username !== "") {
          const channelData: IChannel = {
            name: username,
            status: status,
            /* time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, "0"), */
            ownerid: ownerid,
          };
          api
            .post("channel/createChannel", channelData)
            .then((res) => {
              console.log("channel created with success");
              console.log(channelData);
            })
            .catch((res) => {
              console.log("error");
              console.log(res);
            });
        }
      }
    });
    props.setChannelCreated(true);
    props.setNewChannel(false);
=======
      return (false);
  }

  async function createChannels() {
    if (checkifchannelexist() === true)
      return ;
    console.log(ownerid);
    if (username !== "") {
      const channelData: IChannel = {
        name: username,
        status: status,
        /* time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, "0"), */
        ownerid: ownerid,
      };
      await api
      .post("channel/createChannel", channelData)
      .then((res) => {
        console.log("channel created with success");
        console.log(channelData);
      })
      .catch((res) => {
        console.log("error");
        console.log(res);
      });
      props.setChannelCreated(true);
      props.setNewChannel(false);
    }
>>>>>>> [+] change createChannel from socket to req api
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Box sx={{}}>
      <TextField
        sx={{}}
        variant="outlined"
        placeholder="name"
        onChange={(event) => {
          setUsername(event.target.value);
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
