import { Box, Grid, IconButton, List, ListItemButton, Popover, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
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
  const { dmsList, getDmsList } = useContext(DmsContext);
  const { targetUsername } = useContext(MessagesContext);

  function handleClick() {
    props.setChatContent(ChatContent.MESSAGES);
  }

  useEffect(() => {
    getDmsList();
  }, []);

  return (
    <List>
    {dmsList.map((dm: any) => {
      return (
        <ListItemButton
          key={dm.id}
          onClick={handleClick}
        >
          <Typography>{targetUsername}</Typography>
        </ListItemButton>
      );
    })}
    </List>
  );
}
