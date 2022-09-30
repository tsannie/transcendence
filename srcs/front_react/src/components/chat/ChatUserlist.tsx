import { Button, Grid, Menu, MenuItem, Popover, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { FC, useState } from "react";
import UserList, { api } from "../../userlist/UserList";
import { IUser } from "../../userlist/UserList";
import { ChatContent } from "./Chat";
import { IChannel, IDm } from "./types";

interface ChatUserListProps {
  setEnumState: (enumState: ChatContent) => void;
  users: IUser[]
  getAllUsers: () => Promise<void>;
}

export default function ChatUserlist(props: ChatUserListProps) {
  // create enum with 3 strings differentes

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    handleNewMessage(event.currentTarget.innerHTML);
  };

  async function createDm(targetUsername: IDm) {
    await api
      .post("dm/createDm", targetUsername)
      .then((res) => {
        console.log("dm created with success");
        console.log(targetUsername);
      })
      .catch((res) => {
        console.log("invalid create dm");
        console.log(res);
      });
  }

  function handleNewMessage(targetUsername: string) {
    let newDm: IDm = {
      target: targetUsername,
    };

    console.log(newDm);
    console.log('handle new message');
    createDm(newDm);
    props.setEnumState(ChatContent.MESSAGES);
    //props.setIsNewMessage(true);
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
      <UserList handleClick={handleClick} users={props.users} getAllUsers={props.getAllUsers}/>
    </>
  );
}
