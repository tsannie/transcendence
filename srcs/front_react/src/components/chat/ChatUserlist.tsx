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
  const { setMessagesList, setTargetUsername } = useContext(MessagesContext);
  const [users, setUsers] = React.useState<any[]>([]);
  const { userid } = useContext(UserContext);
  const { getDmsList } = useContext(DmsContext);

  async function getAllUsers() {
    await api
      .get("user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((res) => {
        console.log("invalid jwt");
        console.log(res);
      });
  }

  function handleClick(username: string) {
    createNewConv(username);
  }

  async function createDm(targetUsername: IDm) {
    console.log("create dm");
    await api
      .post("dm/createDm", targetUsername)
      .then((res) => {
        console.log("dm created with success");
        console.log(targetUsername);
        console.log(res.data.messages);
        getDmsList();
        setMessagesList(res.data.messages);
      })
      .catch((res) => {
        console.log("invalid create dm");
        console.log(res.response.data.message);
      });
  }

  async function createNewConv(targetUsername: string) {
    let newDm: IDm = {
      target: targetUsername,
      offset: 1,
    };

    console.log(newDm);
    console.log("handle new message");
    createDm(newDm);
    props.setChatContent(ChatContent.MESSAGES);
    setTargetUsername(targetUsername);
  }

  useEffect(() => {
    console.log("get all users");
    getAllUsers();
  }, []);

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
