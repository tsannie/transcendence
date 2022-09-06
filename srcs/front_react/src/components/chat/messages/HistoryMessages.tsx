import { Grid, Typography } from "@mui/material";
import React from "react";

export default function HistoryMessages(props: any) {
  return (
    <Grid
      alignItems="left"
      container
      direction="column"
      sx={{
        maxWidth: "fit-content",
        maxHeight: "fit-content",
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
