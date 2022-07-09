import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function Chat_userlist() {
  function ToggleWindowChat() {
    console.log(`J'ai clique sur l'user`);
  }

  return (
    <Grid>
      <Box onClick={ToggleWindowChat}> Salut </Box>
    </Grid>
  );
}
