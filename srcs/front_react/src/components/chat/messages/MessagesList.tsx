import { List, ListItem } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { IMessage } from "../types";

interface MessagesListProps {
  setMessagesList: any;
  messagesList: IMessage[];
  username: string;
}

export default function MessagesList(props: MessagesListProps) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log("listen message");
    socket.on("message", (data) => {
      console.log(data);
      props.setMessagesList.push(data);
    });
  }, []);

  return (
    <List>
      {props.messagesList.map((messageData: IMessage) => {
        //console.log("uuid du msg", messageData.uuid);
        //if (props.username === messageData.author)
        return (
          <ListItem
            sx={{
              width: "fit-content",
              height: "fit-content",
              backgroundColor: "#064fbd",
              color: "white",
              fontFamily: "sans-serif",
              fontSize: 16,
              borderRadius: 12,
              ml: "auto",
              mr: 0.5,
              mb: 1,
              p: 1,
            }}
            key={messageData.uuid}
          >
            {messageData.content}
          </ListItem>
        );
        return (
          <Box
            sx={{
              width: "fit-content",
              height: "fit-content",
              backgroundColor: "#f1f1f1",
              color: "black",
              fontFamily: "sans-serif",
              fontSize: 16,
              borderRadius: 12,
              ml: 0.5,
              mr: "auto",
              mb: 1,
              p: 1,
            }}
            key={messageData.uuid}
          >
            {messageData.content}
          </Box>
        );
      })}
    </List>
  );
}
