import { Box, IconButton } from "@mui/material";
import React from "react";
import MessagesList from "./MessagesList";
import PromptMessage from "./PromptMessage";
import AddIcon from "@mui/icons-material/Add";
import { IMessage } from "../types";

interface ConvProps {
  messagesList: IMessage[];
  username: string;
  setCurrentMessage: (message: string) => void;
  //setMessagesList: (list: IMessage[]) => void;
  sendMessage: () => void;
}

export default function Conv(props: ConvProps) {
  /* function newConv() {
    props.setOpenConv(true);
    props.setIsNewMessage(true);
  }
 */
  return (
    <Box sx={{ border: "1px solid green", minHeight: 300 }}>
      <MessagesList /* messagesList={props.messagesList} */ username={props.username} /* setMessagesList={props.setMessagesList} */ />
      <PromptMessage
        setCurrentMessage={props.setCurrentMessage}
        sendMessage={props.sendMessage}
      />
    </Box>
  );
}
