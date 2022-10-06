import {
  Button,
  Grid,
  List,
  ListItem,
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
import { SocketContext } from "./SocketContext";
import { IChannel, IDm, IMessage } from "./types";

interface ChatUserListProps {
  userId: number;
  setMessagesList: (messagesList: IMessage[]) => void;
  setTargetUsername: (targetUsername: string) => void;
  setChatContent: (chatContent: ChatContent) => void;
}

export default function ChatUserlist(props: ChatUserListProps) {
  const socket = useContext(SocketContext);
  const [users, setUsers] = React.useState<any[]>([]);

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

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    createNewConv(event.currentTarget.innerHTML);
    console.log(event.currentTarget.innerHTML);
  }

  async function createDm(targetUsername: IDm) {
    console.log("create dm");
    await api
      .post("dm/createDm", targetUsername)
      .then((res) => {
        console.log("dm created with success");
        console.log(targetUsername);
        console.log(res.data.messages);
        //socket.emit("getConv", res.data);
        props.setMessagesList(res.data.messages);
      })
      .catch((res) => {
        console.log("invalid create dm");
        console.log(res.response.data.message);
      });
  }

  async function createNewConv(targetUsername: string) {
    let newDm: IDm = {
      target: targetUsername,
    };

    console.log(newDm);
    console.log("handle new message");
    createDm(newDm);
    props.setChatContent(ChatContent.MESSAGES);
    props.setTargetUsername(targetUsername);
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
        {users.map((user) => (
          (user.id !== props.userId) && <ListItem key={user.id} onClick={handleClick}>
            {user.username}
          </ListItem>
        ))}
      </List>
    </>
  );
}
