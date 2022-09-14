import { Grid, Typography } from "@mui/material";
import React from "react";

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi

export default function HistoryMessages(props: any) {
  return (
    <Grid
      alignItems="left"
      container
      direction="column"
      sx={{
        maxWidth: "fit-content",
        maxHeight: "fit-content",
        border: "1px solid red",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
        }}
        variant="h6"
      >
        Conv history
      </Typography>
      <Grid
        item
        sx={{
          display: { xs: props.isNewMessage ? "block" : "none" },
        }}
      >
        <Typography
          sx={{
            fontWeight: "semi-bold",
          }}
          variant="subtitle1"
        >
          Conv 1
        </Typography>
      </Grid>
    </Grid>
  );
}
