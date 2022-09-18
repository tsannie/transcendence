import { Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import UserList, { api } from "../../userlist/UserListItem";
import UserInfos, { IUser } from "../../userlist/UserListItem";
import { IChannel } from "./types";

export default function ChatUserlist(props: any) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [targetUsername, setTargetUsername] = useState("");
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget.innerHTML);
    setTargetUsername(event.currentTarget.innerHTML);
  };

  function handleClose() {
    setAnchorEl(null);
  }

  function sendReceiverName(receiver: IUser) {
    props.setReceiver(receiver);
  }

  function handleProfile() {
    console.log('handle profile');
    setAnchorEl(null);
  }

  function handleInvite() {
    console.log('handle invite');
    setAnchorEl(null);
  }

  async function createDm(targetUsername: string) {
    await api
      .post("dm/createDm", targetUsername)
      .then((res) => {
        console.log("channel joined with success");
        console.log(targetUsername);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  function handleNewMessage() {
    createDm(targetUsername);
    props.setOpenConv(true);
    console.log('handle new message');
    setAnchorEl(null);
    props.setIsNewMessage(true);
    //sendReceiverName(props.user);
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        border: "1px solid pink",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          textAlign: "center",
        }}
        variant="h5"
      >
        Users
      </Typography>
      <Box>
        <Box>
          <UserList handleClick={handleClick} />
        </Box>
        <Menu
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleNewMessage}>New Message</MenuItem>
          <MenuItem onClick={handleInvite}>Invite to play</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
