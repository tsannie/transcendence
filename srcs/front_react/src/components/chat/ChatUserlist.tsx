import { Button, Grid, Menu, MenuItem, Popover, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { FC, useState } from "react";
import UserList, { api } from "../../userlist/UserList";
import { IUser } from "../../userlist/UserList";
import { IChannel, IDm } from "./types";

interface ChatUserListProps {
  setOpenConv: (conv: boolean) => void;
  users: any[]
  getAllUsers: Promise<any[]>
}

export default function ChatUserlist(props: ChatUserListProps) {
  const [targetUsername, setTargetUsername] = useState("");
  // create enum with 3 strings differentes

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setTargetUsername(event.currentTarget.innerHTML);
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

  async function handleNewMessage() {
    let newDm: IDm = {
      target: targetUsername,
    };

    console.log('handle new message');
    await createDm(newDm);
    props.setOpenConv(true);
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
      <UserList handleClick={handleNewMessage} users={props.users} getAllUsers={props.getAllUsers}/>
    </>
  );
}
