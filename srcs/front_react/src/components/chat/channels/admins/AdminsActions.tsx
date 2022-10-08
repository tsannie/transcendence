import { Button, List, ListItem, Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../../const/const";
import { IChannel } from "../../types";
import BanUser from "./BanUser";
import MakeAdmin from "./MakeAdmin";
import MuteUser from "./MuteUser";
import RevokeAdmin from "./RevokeAdmin";
import UnbanUser from "./UnbanUser";
import UnmuteUser from "./UnmuteUser";

interface AdminsActionsProps {
  userTargeted: any;
  //channelData: any;
  //getChannelsUserlist: () => void;
  //setUserStatus: (userStatus: string) => void;
}

export default function AdminsActions(props: AdminsActionsProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    //props.getChannelsUserlist();
  }

  function handleClose() {
    setAnchorEl(null);
  }
  console.log("admin actions)");

  return (
    <List>
      <ListItem>
        <BanUser userTargeted={props.userTargeted} />
      </ListItem>
      <ListItem>
        <UnbanUser userTargeted={props.userTargeted} />
      </ListItem>
      <ListItem>
        <MuteUser userTargeted={props.userTargeted} />
      </ListItem>
      <ListItem>
        <UnmuteUser userTargeted={props.userTargeted} />
      </ListItem>
      <ListItem>
        <MakeAdmin userTargeted={props.userTargeted} />
      </ListItem>
      <ListItem>
        <RevokeAdmin userTargeted={props.userTargeted} />
      </ListItem>
    </List>
  );
}
