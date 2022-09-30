import { Box, IconButton } from "@mui/material";
import React from "react";
import MessagesList from "./MessagesList";
import PromptMessage from "./PromptMessage";
import AddIcon from "@mui/icons-material/Add";

export default function Conv(props: any) {
  /* function newConv() {
    props.setOpenConv(true);
    props.setIsNewMessage(true);
  }
 */
  return (
    <Box sx={{ border: "1px solid green", minHeight: 300 }}>
      <MessagesList messagesList={props.messagesList} author={props.author} />
      <PromptMessage
        setCurrentMessage={props.setCurrentMessage}
        currentMessage={props.currentMessage}
        sendMessage={props.sendMessage}
      />
    </Box>
  );
}
