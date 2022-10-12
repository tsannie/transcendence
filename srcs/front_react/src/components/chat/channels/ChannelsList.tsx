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
import InfosChannels from "./InfosChannels";
import AdminsActions from "./admins/AdminsActions";
import { ChatContent } from "../Chat";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import { MessagesContext } from "../../../contexts/MessagesContext";

// to do: channel list
// faire un call api to channel/all pour afficher les channels

interface ChannelsListProps {
  setChatContent: (chatContent: ChatContent) => void;
  setIsOpenInfos: (isOpenInfos: boolean) => void;
}

export default function ChannelsList(props: ChannelsListProps) {
  const [channelPassword, setChannelPassword] = useState("");
  const [channelExistsError, setChannelExistsError] = useState("");
  const { channelsList, setChannelData } = useContext(ChannelsContext);
  const { loadMessages, isDm, setIsDm, setConvId } = useContext(MessagesContext);

  async function getChannelDatas(channel: any) {
    await api
      .get("channel/datas", {
        params: {
          name: channel.name,
        },
      })
      .then((res) => {
        //console.log("get infos of channel clicked by user");
        setChannelData(res.data);
        props.setIsOpenInfos(true);
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
  }

  function handleClick(channel: IChannel) {
    props.setChatContent(ChatContent.CHANNEL_CONTENT);
    getChannelDatas(channel);
    setIsDm(false);
    setConvId(channel.id);
    loadMessages(channel.id, false);
    //console.log("channel clicked", channel);
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
