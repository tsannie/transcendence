import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import Add from "../../../assets/add.png";
import { IDm } from "../types";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ChatContent } from "../Chat";
import { api } from "../../../const/const";
import { DmsContext } from "../../../contexts/DmsContext";
import DmsList from "./DmsList";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";

interface DmProps {
  setChatContent: (chatContent: ChatContent) => void;
}

export default function Dms(props: DmProps) {
  const [newDm, setNewDm] = useState(false);
  const { getDmsList } = useContext(DmsContext);
  const { getAllUsers } = useContext(AuthContext) as AuthContextType;

  function setDm() {
    //setAnchorEl(event.currentTarget);
    setNewDm(true);
    getAllUsers();
    props.setChatContent(ChatContent.NEW_DM);
  }

  return (
    <Box sx={{ border: "1px solid red", width: "100%" }}>
      <Typography
        sx={{
          fontWeight: "bold",
        }}
        variant="h5"
      >
        Dms
      </Typography>
      <IconButton onClick={() => getDmsList()}>
        <RefreshIcon />
      </IconButton>
      <IconButton onClick={setDm}>
        <AddIcon sx={{ color: "blue" }} />
      </IconButton>
      <DmsList setChatContent={props.setChatContent} />
    </Box>
  );
}
