import { Button, Grid, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import UserList from "../../userlist/UserListItem";
import UserInfos, { IUser } from "../../userlist/UserListItem";

export default function ChatUserlist(props: any) {

  function toggleWindowChat() {
    console.log(`J'ai clique sur l'user`);
  }

  return (
    <Grid
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
        <UserList />
      </Box>
    </Grid>
  );
}
