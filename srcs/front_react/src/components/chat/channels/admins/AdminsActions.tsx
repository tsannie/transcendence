import { Button, List, ListItem, Popover } from "@mui/material";
import { channel } from "diagnostics_channel";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../../const/const";
import { ChannelsContext } from "../../../../contexts/ChannelsContext";
import { IChannel } from "../../types";
import BanUser from "./BanUser";
import MakeAdmin from "./MakeAdmin";
import MuteUser from "./MuteUser";
import RevokeAdmin from "./RevokeAdmin";
import UnbanUser from "./UnbanUser";
import UnmuteUser from "./UnmuteUser";

interface AdminsActionsProps {
  userTargeted: any;
}

export default function AdminsActions(props: AdminsActionsProps) {
  const { channelData } = useContext(ChannelsContext);

  function isBan() {

    console.log("channelData = ", channelData);
    if (channelData.banned && channelData.banned.length > 0) {
      return channelData.bannedUsers.find(
        (user: any) => user.username === props.userTargeted.username
      );
    }
  }

  console.log("admin actions)");

  return (
    <List>
      <ListItem>
      {!isBan() ? (

        <BanUser userTargeted={props.userTargeted} />
      ) : (
        <UnbanUser userTargeted={props.userTargeted} />
      )}
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
