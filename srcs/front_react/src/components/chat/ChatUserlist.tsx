import { Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import UserList, { api } from "../../userlist/UserList";
import { IUser } from "../../userlist/UserList";
import { IChannel, IDm } from "./types";

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

  function handleProfile() {
    console.log('handle profile');
    setAnchorEl(null);
  }

  function handleInvite() {
    console.log('handle invite');
    setAnchorEl(null);
  }

  async function createDm(targetUsername: IDm) {
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
    let newDm: IDm = {
      targetUsername: targetUsername,
    };

    console.log('handle new message');
    console.log(targetUsername);
    createDm(newDm);
    props.setOpenConv(true);
    setAnchorEl(null);
    props.setIsNewMessage(true);
    //sendReceiverName(props.user);
  }

  return (
    <>
      <Typography
        sx={{
          fontWeight: "bold",
          textAlign: "center",
        }}
        variant="h5"
      >
        Users
      </Typography>
      <UserList handleClick={handleClick} users={props.users} getAllUsers={props.getAllUsers}/>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleNewMessage}>New Message</MenuItem>
        <MenuItem onClick={handleInvite}>Invite to play</MenuItem>
      </Menu>

    </>
  );
}
