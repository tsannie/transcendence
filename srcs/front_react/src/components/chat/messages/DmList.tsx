import { Box, Grid, IconButton, Popover, Typography } from "@mui/material";
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

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi

interface DmListProps {
  setChatContent: (chatContent: ChatContent) => void;
}

export default function DmList(props: DmListProps) {
  const [newDm, setNewDm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { dmsList, getDmsList } = useContext(DmsContext);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    setNewDm(true);
    props.setChatContent(ChatContent.NEW_DM);
  }

  useEffect(() => {
    getDmsList();
  }, []);

  return (
    <Box sx={{ border: "1px solid red" }}>
      DmList
      <IconButton onClick={handleClick}>
        <AddIcon sx={{ color: "blue" }} />
      </IconButton>
      <IconButton onClick={() => getDmsList()}>
        <RefreshIcon />
      </IconButton>
      {dmsList.map((dm: any) => {
        return (
          <div key={dm.id}>
            <Typography>{dm.id}</Typography>
          </div>
        );
      })}

    </Box>
  );
}
