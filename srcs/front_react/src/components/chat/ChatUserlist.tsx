import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function ChatUserlist() {
  function ToggleWindowChat() {
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
        }}
        variant="h5"
      >
        Users
      </Typography>
      <Box onClick={ToggleWindowChat}> Chat userlist </Box>
    </Grid>
  );
}
