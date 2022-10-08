import {
  Alert,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import { IChannel } from "../types";
import { display } from "@mui/system";
import { LockIcon } from "./LockIcon";
import InfosChannels from "./InfosChannels";
import AdminsActions from "./admins/AdminsActions";
import { ChatContent } from "../Chat";
import { ChannelsContext } from "../../../contexts/ChannelsContext";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

interface ChannelsListProps {
  //channelsList: IChannel[];
  //getChannelsUserlist: () => void;
  setChatContent: (chatContent: ChatContent) => void;
  setCurrentChannel: (currentChannel: IChannel) => void;
  setIsOpenInfos: (isOpenInfos: boolean) => void;
}

export default function ChannelsList(props: ChannelsListProps) {
  const [channelPassword, setChannelPassword] = useState("");
  const [channelExistsError, setChannelExistsError] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const { channelsList, getChannelsUserlist } = useContext(ChannelsContext);

  async function getInfosChannel(channel: any) {
    await api
      .get("channel/datas", {
        params: {
          name: channel.name,
        },
      })
      .then((res) => {
        console.log("get infos of channel clicked by user");
        console.log("status = ", res.data.status);
        props.setCurrentChannel(res.data);
        props.setIsOpenInfos(true);
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
    console.log("bbbbb");
  }

  function handleClick(channel: IChannel) {
    props.setChatContent(ChatContent.CHANNEL_CONTENT);
    getInfosChannel(channel);
    console.log("channel clicked", channel);
  }

  return (
    <List>
      {channelsList.map((channelData: IChannel) => {
        return (
          <ListItemButton
            sx={{
              color: "black",
              textAlign: "center",
              borderRadius: "3px",
              mb: "1vh",
              border: "1px solid black",
            }}

            key={channelData.name}
            onClick={() => handleClick(channelData)}
          >
            <ListItemText sx={{ml: "1vw"}}>
              {channelData.name}
            </ListItemText>
            <>{channelData.status === "Protected" ? <LockIcon /> : <></>}</>
            <TextField
              sx={{
                minWidth: "15vw",
                display: channelData.status === "Protected" ? "block" : "none",
              }}
              placeholder="password"
              type="password"
              onChange={(event) => {
                setChannelPassword(event.target.value);
              }}
            ></TextField>
          </ListItemButton>
        );
      })}
    </List>
  );
}
