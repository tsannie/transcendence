import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import Paperplane from "../../../assets/paperplane.png";
import { MessagesContext } from "../../../contexts/MessagesContext";

interface PromptMessageProps {}

export default function PromptMessage(props: PromptMessageProps) {

  const { setCurrentMessage, sendMessage } = useContext(MessagesContext);

  return (
    <Box
      sx={{
        width: "fit-content",
        mx: "auto",
        position: "fixed",
       // bottom: "0",
        // mettre en bas
      }}
    >
      <TextField
        id="input-message"
        variant="outlined"
        placeholder="Enter a message"
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
      />
      <Box
        component="img"
        alt="send message img"
        src={Paperplane}
        onClick={sendMessage}
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
