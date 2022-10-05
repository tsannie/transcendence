import { Box, Grid, IconButton, Popover, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { IConvCreated, IDm, IMessage } from "../types";
import AddIcon from "@mui/icons-material/Add";
import ChatUserlist from "../ChatUserlist";
import { ChatContent } from "../Chat";
import { Socket } from "socket.io-client";
import { SocketContext } from "../SocketContext";

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi

interface DmListProps {
  isNewMessage: boolean;
  setEnumState: (enumState: ChatContent) => void;
  getAllUsers: () => Promise<void>;
  users: any[];
}

export default function DmList(props: DmListProps) {
  const [dms, setDms] = useState<IConvCreated[]>([]);
  const [newDm, setNewDm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const socket = useContext(SocketContext);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    setNewDm(true);
    props.setEnumState(ChatContent.NEW_DM);
  }

  useEffect(() => {
    socket.on("getDm", (data: IConvCreated[]) => {
      console.log("getDm");
      console.log(data);

      // loop through all data and setDms
      setDms(data);
      console.log("dms = ", dms);
    });
  }, []);

  return (
    <Box sx={{ border: "1px solid red" }}>
      DmList
      <IconButton onClick={handleClick}>
        <AddIcon sx={{ color: "blue" }} />
      </IconButton>

      {/* {dms.map((dm: IConvCreated) => {
        return (
          <div key={dm.id}>
            <Typography>{dm.id}</Typography>
          </div>
        );
      })} */}

    </Box>
  );
}
