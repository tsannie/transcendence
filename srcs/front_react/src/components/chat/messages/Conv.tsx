import { Box, Grid, IconButton } from "@mui/material";
import React, { useContext } from "react";
import MessagesList from "./MessagesList";
import PromptMessage from "./PromptMessage";
import AddIcon from "@mui/icons-material/Add";
import { IMessage } from "../types";
import { MessagesContext } from "../../../contexts/MessagesContext";
import { UserContext } from "../../../contexts/UserContext";

interface ConvProps {
  //messagesList: IMessage[];
  //username: string;
  //setCurrentMessage: (message: string) => void;
  //setMessagesList: (list: IMessage[]) => void;
  //sendMessage: () => void;
}

export default function Conv(props: ConvProps) {
  /* function newConv() {
    messages.setOpenConv(true);
    messages.setIsNewMessage(true);
  }
 */
  const { username } = useContext(UserContext);

  return (
    <Grid sx={{ border: "1px solid green", minHeight: 300 }}>
      <MessagesList username={username} />
      <PromptMessage />
    </Grid>
  );
}
