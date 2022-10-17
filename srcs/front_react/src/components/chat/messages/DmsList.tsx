import {
  Box,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { IConvCreated, IDm, IMessage } from "../types";
import AddIcon from "@mui/icons-material/Add";
import ChatUserlist from "../ChatUserlist";
import { ChatContent } from "../Chat";
import { Socket } from "socket.io-client";
import { SocketContext } from "../../../contexts/SocketContext";
import { api } from "../../../const/const";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DmsContext } from "../../../contexts/DmsContext";
import { MessagesContext } from "../../../contexts/MessagesContext";
import { UserContext } from "../../../contexts/UserContext";
import { reverse } from "dns";

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi

interface DmsListProps {
  setChatContent: (chatContent: ChatContent) => void;
}

export default function DmsList(props: DmsListProps) {
  const { dmsList, setDmData } = useContext(DmsContext);
  const { loadMessages, setIsDm, setConvId } = useContext(MessagesContext);
  const { userConnected } = useContext(UserContext);

  // find target username with conv id and user id
  function findTargetUsername(dmId: number) {
    let targetUsername = "";
    let dm = dmsList.find((dm) => dm.id === dmId);
    if (dm) {
      dm.users.forEach((user) => {
        if (user.username !== userConnected.username) {
          targetUsername = user.username;
        }
      });
    }
    return targetUsername;
  }

  async function getDmDatas(dm: any) {
    await api
      .get("dm/getByTarget", {
        params: {
          target: findTargetUsername(dm.id),
        },
      })
      .then((res) => {
        console.log("get infos of channel clicked by user");
        setDmData(res.data);
      })
      .catch((res) => {
        console.log("invalid dm data");
        console.log(res.response.data.message);
      });
  }

  async function handleClick(dm: any) {
    props.setChatContent(ChatContent.MESSAGES);
    getDmDatas(dm);
    console.log("dm id clicked", dm.id);
    setIsDm(true);
    setConvId(dm.id);
    loadMessages(dm.id, true);
    console.log("click on user dms list");
  }

  return (
    <List>
      {dmsList.map((dm: any) => {
        return (
          <ListItemButton key={dm.id} onClick={() => handleClick(dm)}>
            <ListItemText>{findTargetUsername(dm.id)}</ListItemText>
          </ListItemButton>
        );
      })}
    </List>
  );
}
