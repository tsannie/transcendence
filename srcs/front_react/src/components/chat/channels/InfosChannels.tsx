import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import { IChannel } from "../types";
import AdminsActions from "./admins/AdminsActions";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import { UserContext } from "../../../contexts/UserContext";

interface InfosChannelsProps {
  getChannelDatas: any;
  channelData: any;
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [channelId, setChannelId] = useState(0);
  const [displayAdminActions, setDisplayAdminActions] = useState(false);
  const [open, setOpen] = React.useState(true);
  //const { channelData } = useContext(ChannelsContext);
  const { userConnected } = useContext(UserContext);

  function handleClick(event: any) {
    console.log("click on user who i wnat to ban, mute etc");
    console.log("channel", props.channelData);
    setDisplayAdminActions(true);
    //props.getChannelsUserlist();
    setOpen(!open);
  }

  return (
    <Grid container>
      <Grid item>
        <List>
          Owner
          <ListItem key={props.channelData.data.name}>
            <ListItemButton
              onClick={handleClick}
              disabled={
                userConnected.username !== props.channelData.data.owner.username
              }
            >
              {<ListItemText>{props.channelData.data.owner.username}</ListItemText>}
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>

      <Grid item>
        <List>
          Admins
          {props.channelData.data.admins.map((user: any) => (
            <ListItem key={user.username}>
              <ListItemButton
                onClick={handleClick}
                disabled={props.channelData.status !== "owner"}
              >
                <ListItemText primary={user.username}></ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <AdminsActions userTargeted={user} getChannelDatas={props.getChannelDatas} channelData={props.channelData} />
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid item>
        <List>
          Users
          {props.channelData.data.users.map((user: any) => (
            <ListItem key={user.username}>
              <ListItemButton
                onClick={handleClick}
                disabled={
                  props.channelData.status !== "owner" &&
                  props.channelData.status !== "admin"
                }
              >
                <ListItemText primary={user.username}></ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={!open} timeout="auto" unmountOnExit>
                <AdminsActions userTargeted={user} getChannelDatas={props.getChannelDatas} channelData={props.channelData} />
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Grid>
      {
        props.channelData.data.banned && props.channelData.data.banned.length > 0 ? (
      <Grid item>
        <List>
          Banned
          {props.channelData.data.banned.map((user: any) => (
            <ListItem key={user.username}>
              <ListItemButton
                onClick={handleClick}
                disabled={
                  props.channelData.status !== "owner" &&
                  props.channelData.status !== "admin"
                }
              >
                <ListItemText primary={user.username}></ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={!open} timeout="auto" unmountOnExit>
                <AdminsActions userTargeted={user} getChannelDatas={props.getChannelDatas} channelData={props.channelData} />
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Grid>
        ) : null
      }
    </Grid>
  );
}
