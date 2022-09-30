import {
  Box,
  Grid,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IDm, IMessage } from "../types";
import AddIcon from "@mui/icons-material/Add";
import ChatUserlist from "../ChatUserlist";
import { ChatContent } from "../Chat";
import { IUser } from "../../../userlist/UserList";

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi

interface DmListProps {
  isNewMessage: boolean;
  setEnumState: (enumState: ChatContent) => void;
  getAllUsers: () => Promise<void>;
  users: IUser[]
}

export default function DmList(props: DmListProps) {
  const [dms, setDms] = useState<IDm[]>([]);
  const [newDm, setNewDm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    setNewDm(true);
    props.setEnumState(ChatContent.NEW_DM);
  }

  function handleClose() {
    setAnchorEl(null);
    setNewDm(false);
  }

  /* useEffect(() => {
    props.socket.on("getDM", (data: any) => {
      console.log("getDM");
      console.log(data);
      setDms(data);
    });
    //getAllDms();
  }, [dms]);
 */

  return (
    <Box sx={{ border: "1px solid red" }}>
      DmList
      <IconButton onClick={handleClick}>
        <AddIcon sx={{ color: "blue" }} />
      </IconButton>
    </Box>
  );
}
