import { List, ListItem } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { DmsContext } from "../../../contexts/DmsContext";
import { MessagesContext } from "../../../contexts/MessagesContext";
import { SocketContext } from "../../../contexts/SocketContext";
import { UserContext } from "../../../contexts/UserContext";
import { IMessage } from "../types";

interface MessagesListProps {}

export default function MessagesList(props: MessagesListProps) {
  const { messagesList } = useContext(MessagesContext);
  const { userConnected } = useContext(UserContext);
  const { convId } = useContext(MessagesContext);

    return (
      <List key={convId} sx={{ position: "relative" }} >
        {[...messagesList].reverse().map((messageData: IMessage) => {
          if (userConnected.username === messageData.author.username)
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
