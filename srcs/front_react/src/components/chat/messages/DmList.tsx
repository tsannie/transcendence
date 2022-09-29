import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import UserList, { api } from "../../../userlist/UserList";
import { IDm, IMessage } from "../types";
import AddIcon from "@mui/icons-material/Add";
import { Usb } from "@material-ui/icons";
import ChatUserlist from "../ChatUserlist";

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi

export default function DmList(props: any) {
  const [dms, setDms] = React.useState<Array<IDm>>([]);
  const [newDm, setNewDm] = React.useState(false);

  function handleClick() {
    console.log("click");
    // TODO new conv with user

    setNewDm(true);
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
      {newDm && (
        <ChatUserlist
          setOpenConv={props.setOpenConv}
          setIsNewMessage={props.setIsNewMessage}
          getAllUsers={props.getAllUsers}
          users={props.users}
        />
      )}
    </Box>
  );
}
