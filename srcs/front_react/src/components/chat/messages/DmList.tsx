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

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi

export default function DmList(props: any) {
  const [dms, setDms] = useState<Array<IDm>>([]);
  const [newDm, setNewDm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    setNewDm(true);
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
     {/*  {newDm && (
        <Popover open={newDm} anchorEl={anchorEl} onClose={handleClose}>
          <ChatUserlist
            setOpenConv={props.setOpenConv}
            getAllUsers={props.getAllUsers}
            users={props.users}
          />
        </Popover>
      )} */}
    </Box>
  );
}
