import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { FC, useContext, useEffect, useState } from "react";
import { set } from "react-hook-form";
import { Socket } from "socket.io-client";
import { api } from "../../const/const";
import { ChatContent } from "./Chat";
import { SocketContext } from "../../contexts/SocketContext";
import { IChannel, IDm, IMessage } from "./types";
import { MessagesContext } from "../../contexts/MessagesContext";
import { UserContext } from "../../contexts/UserContext";
import { DmsContext } from "../../contexts/DmsContext";

interface ChatUserListProps {
  setChatContent: (chatContent: ChatContent) => void;
}

export default function ChatUserlist(props: ChatUserListProps) {
  const { userid, users } = useContext(UserContext);
  const { getDmsList } = useContext(DmsContext);
  const { setTargetUsername } = useContext(MessagesContext);

  function handleClick(username: string) {
    createNewConv(username);
  }

  async function createDm(targetUsername: Partial<IDm>) {
    console.log("create dm");
    await api
      .post("dm/create", targetUsername)
      .then((res) => {
        console.log("dm created with success");
        console.log(targetUsername);
        getDmsList();
      })
      .catch((res) => {
        console.log("invalid create dm");
        console.log(res.response.data.message);
      });
  }

  async function createNewConv(targetUsername: string) {
    let newDm: Partial<IDm> = {
      target: targetUsername,
    };

    setTargetUsername(targetUsername);
    console.log(newDm);
    console.log("handle new message");
    createDm(newDm);
    props.setChatContent(ChatContent.MESSAGES);
  }

  return (
    <>
      <Typography
        sx={{
          fontWeight: "bold",
          textAlign: "center",
        }}
        variant="h5"
      >
        Users
      </Typography>
      <List>
        {users.map(
          (user) =>
            user.id !== userid && (
              <ListItemButton
                key={user.id}
                onClick={() => handleClick(user.username)}
                sx={{
                  width: "fit-content",
                }}
              >
                {user.username}
              </ListItemButton>
            )
        )}
      </List>
    </>
  );
}
