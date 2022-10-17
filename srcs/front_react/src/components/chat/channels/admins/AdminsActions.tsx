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

  function isBan(channel: any): boolean {
    for (let i = 0; channel.data.banned && i < channel.data.banned.length; i++) {
      if (channel.data.banned[i].id === props.userTargeted.id) {
        return true;
      }
    }
    return false;
  }

  function isMute(channel: any): boolean {
    for (let i = 0; channel.data.muted && i < channel.data.muted.length; i++) {
      if (channel.data.muted[i].id === props.userTargeted.id) {
        return true;
      }
    }
    return false;
  }

  function isAdmin(channel: any): boolean {
    for (let i = 0; channel.data.admins && i < channel.data.admins.length; i++) {
      if (channel.data.admins[i].id === props.userTargeted.id) {
        return true;
      }
    }
    return false;
  }

  return (
    <List>
      <ListItem>
        {!isBan(props.channelData) ? (
          <BanUser userTargeted={props.userTargeted} getChannelDatas={props.getChannelDatas} channelData={props.channelData} />
        ) : (
          <UnbanUser userTargeted={props.userTargeted} getChannelDatas={props.getChannelDatas} channelData={props.channelData} />
        )}
      </ListItem>
      <ListItem>
        {!isMute(props.channelData) ? (
          <MuteUser userTargeted={props.userTargeted} getChannelDatas={props.getChannelDatas} channelData={props.channelData}/>
        ) : (
          <UnmuteUser userTargeted={props.userTargeted} getChannelDatas={props.getChannelDatas} channelData={props.channelData}/>
        )}
      </ListItem>
      <ListItem>
        {!isAdmin(props.channelData) ? (
          <MakeAdmin userTargeted={props.userTargeted} getChannelDatas={props.getChannelDatas} channelData={props.channelData}/>
        ) : (
          <RevokeAdmin userTargeted={props.userTargeted} getChannelDatas={props.getChannelDatas} channelData={props.channelData}/>
        )}
      </ListItem>
    </List>
  );
}
