import {
  Alert,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Popover,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../userlist/UserListItem";
//import { socket } from "../Chat";
import { IChannel } from "../types";
import { display } from "@mui/system";
import { LockIcon } from "./LockIcon";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

export default function ChannelsList(props: any) {
  const [channelPassword, setChannelPassword] = useState("");
  const [channelExistsError, setChannelExistsError] = useState("");
  //const [infosChannels, setInfosChannels] = useState<IChannel>({} as IChannel);
  let infosChannels: Object;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function handleClick(
    channel: IChannel,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    setAnchorEl(event.currentTarget);
    infosChannel(channel);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  // TODO: find value with keys string in object


  function joinNewChannelWithoutStatus(channel: IChannel) {
    if (channel.status === "Protected") {
      channel.password = channelPassword;
    }
    console.log(channel);

    const newChannel = {
      name: channel.name,
      password: channel.password,
    };
    console.log(newChannel);

    return newChannel;
  }

  async function infosChannel(channel: IChannel) {

    await api
      .get("channel/privateData", {
        params: {
          name: channel.name,
        },
      })
      .then((res) => {
        console.log("channel private data");
        console.log(res.data);
        infosChannels = res.data;
        //setInfosChannels(res.data);
      })
      .catch((res) => {
        console.log("invalid channels private data");
        // display response error
        //console.log(res.response.data.message);
        //console.log(res);
      });
  }

  async function joinChannel(channel: IChannel) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    await api
      .post("channel/joinChannel", newChannel)
      .then((res) => {
        console.log("channel joined with success");
        console.log(channel);
      })
      .catch((res) => {
        console.log("invalid channels");
        // display response error
        console.log(res.response.data.message);
        setChannelExistsError(res.response.data.message);

        //console.log(res);
      });
    setChannelPassword("");
    setChannelExistsError("");
    // to do: refresh password after send (look send message)
  }

  async function leaveChannel(channel: IChannel) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    await api
      .post("channel/leaveChannel", newChannel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  async function deleteChannel(channel: IChannel) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    await api
      .post("channel/deleteChannel", newChannel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  return (
    <Box>
      {props.channelsList.map((channelData: IChannel) => {
        return (
          <Box
            sx={{
              width: "fit-content",
              height: "fit-content",
              color: "black",
              textAlign: "center",
              borderRadius: "3px",
              mb: "1vh",
              border: "1px solid black",
              display: "flex",
              alignItems: "center",
            }}
            key={channelData.name}
          >
            <Box
              sx={{
                height: "100%",
                ml: "1vh",
                color: "black",
                textAlign: "center",
              }}
            >
              {channelData.name}
            </Box>
            <Box>
              {channelData.status === "Protected" ? <LockIcon /> : <div></div>}
            </Box>
            <TextField
              sx={{
                minWidth: "15vw",
                display: channelData.status === "Protected" ? "block" : "none",
              }}
              placeholder="password"
              type="password"
              onChange={(event) => {
                setChannelPassword(event.target.value);
              }}
            ></TextField>

            <Button
              sx={{
                ml: "1vh",
              }}
              // on click join channel if not already in
              onClick={() => {
                joinChannel(channelData);
              }}
            >
              {channelExistsError !== "" && (
                <Alert severity="error"> {channelExistsError}</Alert>
              )}
              Join
            </Button>
            <Button
              sx={{
                color: "green",
                ml: "1vh",
              }}
              onClick={() => leaveChannel(channelData)}
            >
              Leave
            </Button>
            {props.isOwner && (
              <Button
                sx={{
                  color: "red",
                  ml: "1vh",
                }}
                onClick={() => deleteChannel(channelData)}
              >
                Delete
              </Button>
            )}
            <Button
              sx={{
                color: "black",
                ml: "1vh",
              }}
              onClick={(event) => {
                handleClick(channelData, event);
              }}
            >
              Infos
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              {open && (
                <List>
                  <ListItem>
                    <ListItemText
                      primary="owner"
                      //secondary={findValueWithKey(infosChannels, "owner")}
                    />
                  </ListItem>
                  {/* <ListItem>
                  <ListItemText primary="admins" secondary={findValueWithKey(infosChannels, "admins")} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="banned" secondary={findValueWithKey(infosChannels, "banned")} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="muted" secondary={findValueWithKey(infosChannels, "muted")} />
                </ListItem> */}
                </List>
              )}
            </Popover>
          </Box>
        );
      })}
    </Box>
  );
}
