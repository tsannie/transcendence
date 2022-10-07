import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../const/const";
import { IChannel } from "../types";
import AdminsActions from "./admins/AdminsActions";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";

interface InfosChannelsProps {
  username: string;
  channelData: any;
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [channelId, setChannelId] = useState(0);
  const [displayAdminActions, setDisplayAdminActions] = useState(false);
  const [open, setOpen] = React.useState(true);

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
          <ListItem>
            <ListItemButton
              key={props.channelData.data.name}
              onClick={handleClick}
              disabled={props.username !== props.channelData.data.owner}
            >
              {
                <ListItemText>
                  {props.channelData.data.owner.username}
                </ListItemText>
              }
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>

      {props.channelData.status !== "publicUser" && (
        <Grid item>
          <List>
            Admins
            {props.channelData.data.admins.map((user: any) => (
              <ListItem>
                <ListItemButton
                  key={user.username}
                  onClick={handleClick}
                  disabled={props.channelData.status !== "owner"}
                >
                  <ListItemText primary={user.username}></ListItemText>
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <AdminsActions userTargeted={user} channelData={props.channelData} />
                </Collapse>
              </ListItem>
            ))}
          </List>
        </Grid>
      )}

      <Grid item>
        <List>
          Users
          {props.channelData.data.users.map((user: any) => (
            <ListItem>
              <ListItemButton
                key={user.username}
                onClick={handleClick}
                disabled={
                  props.channelData.status !== "owner" &&
                  props.channelData.status !== "admin"
                }
              >
                <ListItemText primary={user.username}></ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <AdminsActions userTargeted={user}  channelData={props.channelData} />
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
