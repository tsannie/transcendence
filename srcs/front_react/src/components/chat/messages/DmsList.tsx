import { Box, Grid, IconButton, List, ListItemButton, ListItemText, Popover, Typography } from "@mui/material";
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

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi

interface DmsListProps {
  setChatContent: (chatContent: ChatContent) => void;
}

export default function DmsList(props: DmsListProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { dmsList, getDmsList, setDmData } = useContext(DmsContext);
  const { targetUsername, loadMessages, isDm, setIsDm, setConvId } = useContext(MessagesContext);

  async function getDmDatas(dm: any) {
    await api
      .get("dm/getByTarget", {
        params: {
          name: dm.name,
        },
      })
      .then((res) => {
        console.log("get infos of channel clicked by user");
        console.log("status = ", res.data.status);
        setDmData(res.data);
        //props.setIsOpenInfos(true);
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
  }

  async function handleClick(dm: any) {
    props.setChatContent(ChatContent.MESSAGES);
    getDmDatas(dm);
    console.log("dm id clicked", dm.id);
    setIsDm(true);
    setConvId(dm.id);
    loadMessages(dm.id, isDm);
    console.log("click on user dms list");
  }

  return (
    <List>
    {dmsList.map((dm: any) => {
      return (
        <ListItemButton
          key={dm.id}
          onClick={() => handleClick(dm)}
        >
          <ListItemText>
            {targetUsername}
          </ListItemText>
        </ListItemButton>
      );
    })}
    </List>
  );
}
