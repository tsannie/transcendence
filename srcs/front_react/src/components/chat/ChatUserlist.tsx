import { Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import UserList from "../../userlist/UserListItem";
import UserInfos, { IUser } from "../../userlist/UserListItem";

export default function ChatUserlist(props: any) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
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

  function sendReceiverName(receiver: IUser) {
    props.setReceiver(receiver);
  }

  function handleNewMessage() {
    console.log('handle new message');
    setAnchorEl(null);
    props.setIsNewMessage(true);
    sendReceiverName(props.user);
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
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
