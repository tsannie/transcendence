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
  getChannelDatas: any;
  channelData: any;
  setBannedOpen: any;
  setUsersOpen: any;
}

export default function AdminsActions(props: AdminsActionsProps) {
  function isBan(channel: any): boolean {
    for (const ban of channel.data.banned) {
      if (ban.id === props.userTargeted.id) {
        return true;
      }
    }
    return false;
  }

  function isMute(channel: any): boolean {
    for (const mute of channel.data.muted) {
      if (mute.id === props.userTargeted.id) {
        return true;
      }
    }
    return false;
  }

  function isAdmin(channel: any): boolean {
    for (const admin of channel.data.admins) {
      if (admin.id === props.userTargeted.id) {
        return true;
      }
    }
    return false;
  }

  return (
    <List>
      {!isBan(props.channelData) ? (
        <BanUser
          userTargeted={props.userTargeted}
          getChannelDatas={props.getChannelDatas}
          channelData={props.channelData}
          setUsersOpen={props.setUsersOpen}
        />
      ) : (
        <UnbanUser
          userTargeted={props.userTargeted}
          getChannelDatas={props.getChannelDatas}
          channelData={props.channelData}
          setBannedOpen={props.setBannedOpen}
        />
      )}
      <ListItem>
        {!isMute(props.channelData) ? (
          <MuteUser
            userTargeted={props.userTargeted}
            getChannelDatas={props.getChannelDatas}
            channelData={props.channelData}
          />
        ) : (
          <UnmuteUser
            userTargeted={props.userTargeted}
            getChannelDatas={props.getChannelDatas}
            channelData={props.channelData}
          />
        )}
      </ListItem>
      <ListItem>
        {!isAdmin(props.channelData) ? (
          <MakeAdmin
            userTargeted={props.userTargeted}
            getChannelDatas={props.getChannelDatas}
            channelData={props.channelData}
          />
        ) : (
          <RevokeAdmin
            userTargeted={props.userTargeted}
            getChannelDatas={props.getChannelDatas}
            channelData={props.channelData}
            setUsersOpen={props.setUsersOpen}
          />
        )}
      </ListItem>
    </List>
  );
}
