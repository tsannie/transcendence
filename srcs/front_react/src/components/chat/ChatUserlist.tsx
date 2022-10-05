import {
  Button,
  Grid,
  Menu,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { FC, useContext, useEffect, useState } from "react";
import { set } from "react-hook-form";
import { Socket } from "socket.io-client";
import UserList, { api } from "../../userlist/UserList";
import { IUser } from "../../userlist/UserList";
import { ChatContent } from "./Chat";
import { SocketContext } from "./SocketContext";
import { IChannel, IDm, IMessage } from "./types";

interface ChatUserListProps {
  setMessagesList: (messagesList: IMessage[]) => void;
  setTargetUsername: (targetUsername: string) => void;
  setEnumState: (enumState: ChatContent) => void;
  users: IUser[];
  getAllUsers: () => Promise<void>;
}

export default function ChatUserlist(props: ChatUserListProps) {

  const socket = useContext(SocketContext);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    createNewConv(event.currentTarget.innerHTML);
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
        console.log(res);
      });
  }

  async function createNewConv(targetUsername: string) {
    let newDm: IDm = {
      target: targetUsername,
    };

    console.log(newDm);
    console.log("handle new message");
    createDm(newDm);
    props.setEnumState(ChatContent.MESSAGES);
    props.setTargetUsername(targetUsername);
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
      <UserList
        handleClick={handleClick}
        users={props.users}
        getAllUsers={props.getAllUsers}
      />
    </>
  );
}
