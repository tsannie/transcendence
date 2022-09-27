import { Button, List, ListItemButton, Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { IChannel } from "../types";
import BanUser from "./BanUser";
import MuteUser from "./MuteUser";
import UnbanUser from "./UnbanUser";
import UnmuteUser from "./UnmuteUser";

export default function AdminsActions(props: any) {
  const [infosChannel, setInfosChannel] = useState<IChannel>();

  /* function isMuted(channel: any) {
    console.log("channel = ", channel);
    //console.log("channel.muted.length = ", channel.muted.length);
    // parcourir les muted users et return true si userId === muted.id
    if (channel !== undefined) {
      for (let i = 0; i < channel.muted.length; i++) {
        if (channel.muted[i].id === props.userId) {
          return true;
        }
      }
    }
    console.log("isMuted = false");
    return false;
  }

  function isBanned(channel: any) {
    if (channel !== undefined) {
      for (let i = 0; i < channel.banned.length; i++) {
        if (channel.banned[i].id === props.userId) {
          return true;
        }
      }
    }
    return false;
  } */

  async function getInfosChannel(channel: IChannel) {
    await api
      .get("channel/privateData", {
        params: {
          name: channel.name,
        },
      })
      .then((res) => {
        console.log("get infos channels");
        setInfosChannel(res.data);
        //setChannelId(res.data.id);
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
  }

  useEffect(() => {
    getInfosChannel(props.channelData);
  }, [props.channelData]);

  // TODO unmute unban btn

  return (
    <>
      <MuteUser channelData={props.channelData} />
      <UnmuteUser channelData={props.channelData} />
      <BanUser channelData={props.channelData} />
      <UnbanUser channelData={props.channelData} />
    </>
  );
}
