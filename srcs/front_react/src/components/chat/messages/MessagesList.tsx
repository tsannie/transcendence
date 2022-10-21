import { List, ListItem } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";
import { DmsContext } from "../../../contexts/DmsContext";
import { MessagesContext } from "../../../contexts/MessagesContext";
import { SocketContext } from "../../../contexts/SocketContext";
import { IMessage, IMessageReceived } from "../types";

interface MessagesListProps { }

export default function MessagesList(props: MessagesListProps) {
  const { messagesList } = useContext(MessagesContext);
  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <List sx={{ position: "relative" }}>
      {messagesList.map((messageData: IMessageReceived) => {
        if (user?.username === messageData.author.username) {
          return (
            <ListItem
              sx={{
                width: "fit-content",
                height: "fit-content",
                backgroundColor: "#064fbd", // author
                color: "white",
                fontFamily: "sans-serif",
                fontSize: 16,
                borderRadius: 12,
                mr: 0.5,
                mb: 1,
                p: 1,
                right: 0,
              }}
              key={messageData.uuid}
            >
              {messageData.content}
            </ListItem>
          );
        }
        return (
          <ListItem
            sx={{
              width: "fit-content",
              height: "fit-content",
              backgroundColor: "#f1f1f1",
              color: "black",
              fontFamily: "sans-serif",
              fontSize: 16,
              borderRadius: 12,
              ml: 0.5,
              mb: 1,
              p: 1,
              left: 0,
            }}
            key={messageData.uuid}
          >
            {messageData.content}
          </ListItem>
        );
      })}
    </List>
  );
}
