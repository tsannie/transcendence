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
import { api } from "../../const/const";
import { ChatContent } from "./Chat";
import { SocketContext } from "../../contexts/SocketContext";
import { IChannel, ICreateDm, IDm } from "./types";
import { MessagesContext } from "../../contexts/MessagesContext";
import { DmsContext } from "../../contexts/DmsContext";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";

interface ChatUserListProps {
  setChatContent: (chatContent: ChatContent) => void;
}

export default function ChatUserlist(props: ChatUserListProps) {
  const { user, users } = useContext(AuthContext) as AuthContextType;
  const { getDmsList, getDmDatas } = useContext(DmsContext);
  const { loadMessages, setConvId } = useContext(MessagesContext);

  function handleClick(username: string) {
    createNewConv(username);
  }

  async function createDm(targetUsername: ICreateDm) {
    console.log("create dm");
    await api
      .post("dm/create", targetUsername)
      .then((res) => {
        console.log("dm created with success");
        console.log(targetUsername);
        console.log("dm created = ", res.data);
        setConvId(res.data.id);
        getDmDatas(res.data);
        getDmsList();
        loadMessages(res.data.id, true);
      })
      .catch((res) => {
        console.log("invalid create dm");
        console.log(res.response.data.message);
      });
  }

  async function createNewConv(targetUsername: string) {
    let newDm: ICreateDm = {
      target: targetUsername,
    };

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
          (element) =>
            element.id !== user?.id && (
              <ListItemButton
                key={element.id}
                onClick={() => handleClick(element.username)}
                sx={{
                  width: "fit-content",
                }}
              >
                {element.username}
              </ListItemButton>
            )
        )}
      </List>
    </>
  );
}
