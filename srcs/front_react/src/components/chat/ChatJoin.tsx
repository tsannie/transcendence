import { Box, Button, TextField } from "@mui/material";
import React from "react";

export default function ChatJoin(props: any) {
  return (
    <Box sx={{ position: "absolute", top: 0, left: 88 }}>
      <TextField
        variant="outlined"
        placeholder="username"
        onChange={(event) => {
          props.setUsername(event.target.value);
        }}
      />
      <TextField
        variant="outlined"
        placeholder="room"
        onChange={(event) => {
          props.setRoom(event.target.value);
        }}
      />
      <Button
        sx={{ height: 56 }}
        variant="contained"
        onClick={props.createRoom}
      >
        Join a room
      </Button>
    </Box>
  );
}
