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
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [channelId, setChannelId] = useState(0);
  const [displayAdminActions, setDisplayAdminActions] = useState(false);
  const [open, setOpen] = React.useState(true);
  const { channelData } = useContext(ChannelsContext);
  const { username } = useContext(UserContext);

  function handleClick(event: any) {
    console.log("click on user who i wnat to ban, mute etc");
    //console.log("channel", channelData);
    setDisplayAdminActions(true);
    //props.getChannelsUserlist();
    setOpen(!open);
  }

  return (
    <Grid container>
      <Grid item>
        <List>
          Owner
          <ListItem>
            <ListItemButton
              key={channelData.data.name}
              onClick={handleClick}
              disabled={username !== channelData.data.owner.username}
            >
              {
                <ListItemText>
                  {channelData.data.owner.username}
                </ListItemText>
              }
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>

      <Grid item>
        <List>
          Admins
          {channelData.data.admins.map((user: any) => (
            <ListItem>
              <ListItemButton
                key={user.username}
                onClick={handleClick}
                disabled={channelData.status !== "owner"}
              >
                <ListItemText primary={user.username}></ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <AdminsActions userTargeted={user} />
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid item>
        <List>
          Users
          {channelData.data.users.map((user: any) => (
            <ListItem>
              <ListItemButton
                key={user.username}
                onClick={handleClick}
                disabled={
                  channelData.status !== "owner" &&
                  channelData.status !== "admin"
                }
              >
                <ListItemText primary={user.username}></ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={!open} timeout="auto" unmountOnExit>
                <AdminsActions userTargeted={user} />
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
