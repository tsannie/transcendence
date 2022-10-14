import { Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import Paperplane from "../../../assets/paperplane.png";
import { DmsContext } from "../../../contexts/DmsContext";
import { MessagesContext } from "../../../contexts/MessagesContext";

interface PromptMessageProps {}

export default function PromptMessage(props: PromptMessageProps) {
  const { setCurrentMessage, sendMessage, convId } =
    useContext(MessagesContext);
  const { dmData } = useContext(DmsContext);

  return (
    <Box>
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
        onClick={() => sendMessage(convId)}
        sx={{
          width: 18,
          height: 18,
          position: "absolute",
        }}
      ></Box>
    </Box>
  );
}
