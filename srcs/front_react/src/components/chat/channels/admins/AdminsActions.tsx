import { Button, List, ListItem, Popover } from "@mui/material";
import { channel } from "diagnostics_channel";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../../const/const";
import { ChannelsContext } from "../../../../contexts/ChannelsContext";
import { UserContext } from "../../../../contexts/UserContext";
import { IChannel } from "../../types";
import BanUser from "./BanUser";
import MakeAdmin from "./MakeAdmin";
import MuteUser from "./MuteUser";
import RevokeAdmin from "./RevokeAdmin";
import UnbanUser from "./UnbanUser";
import UnmuteUser from "./UnmuteUser";

interface AdminsActionsProps {
  userTargeted: any;
  getChannelDatas: any;
  channelData: any;
}

export default function AdminsActions(props: AdminsActionsProps) {
  //const { channelData, setChannelData } = useContext(ChannelsContext);

  function isBan(channel: any): boolean {
    console.log("channelData = ", channel);
    console.log("userTargeted = ", props.userTargeted);

    for (let i = 0; channel.data.banned && i < channel.data.banned.length; i++) {
      console.log("channelData.data.banned[i] = ", channel.data.banned[i]);
      if (channel.data.banned[i].id === props.userTargeted.id) {
        return true;
      }
    }
    return false;
  }

  console.log("admin actions)");

  return (
    <List>
      <ListItem>
        {!isBan(props.channelData) ? (
          <BanUser userTargeted={props.userTargeted} getChannelDatas={props.getChannelDatas} channelData={props.channelData} />
        ) : (
          <UnbanUser userTargeted={props.userTargeted} getChannelDatas={props.getChannelDatas} channelData={props.channelData} />
        )}
      </ListItem>
      {/* <ListItem>
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
      </ListItem> */}
    </List>
  );
}
