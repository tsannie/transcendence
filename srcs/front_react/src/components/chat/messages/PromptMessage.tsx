import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Paperplane from "../../../assets/paperplane.png";

interface PromptMessageProps {
  setCurrentMessage: (message: string) => void;
  sendMessage: () => void;
}

export default function PromptMessage(props: PromptMessageProps) {
  return (
    <Box
      sx={{
        width: "fit-content",
        mx: "auto",
        position: "fixed",
        //bottom: "0",
        // mettre en bas
      }}
    >
      <TextField
        id="input-message"
        variant="outlined"
        placeholder="Enter a message"
        onChange={(event) => {
          props.setCurrentMessage(event.target.value);
        }}
      />
      <Box
        component="img"
        alt="send message img"
        src={Paperplane}
        onClick={props.sendMessage}
        sx={{
          width: 18,
          height: 18,
          position: "absolute",
          bottom: 0,
        }}
      ></Box>
    </Box>
  );
}
