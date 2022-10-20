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
import UnbanUser from "./admins/UnbanUser";

interface InfosChannelsProps {
  getChannelDatas: any;
  channelData: any;
}

export default function InfosChannels(props: InfosChannelsProps) {
  const [adminsOpen, setAdminsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [bannedOpen, setBannedOpen] = useState(false);

  function handleClickAdmins() {
    setAdminsOpen(!adminsOpen);
  }
  function handleClickUsers() {
    console.log("click on user who i wnat to ban, mute etc");
    console.log("channel", props.channelData);
    setUsersOpen(!usersOpen);
  }
  function handleClickBanned() {
    setBannedOpen(!bannedOpen);
  }

  return (
    <Grid container>
      <Grid item>
        <List>
          Owner
          <ListItem key={props.channelData.data.name}>
            <ListItemText>
              {props.channelData.data.owner.username}
            </ListItemText>
          </ListItem>
        </List>
      </Grid>

      <Grid item>
        <List>
          Admins
          {props.channelData.data.admins.map((user: any) => (
            <ListItem key={user.username}>
              <ListItemButton
                onClick={handleClickAdmins}
                disabled={props.channelData.status !== "owner"}
              >
                <ListItemText primary={user.username}></ListItemText>
                {adminsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={adminsOpen} timeout="auto" unmountOnExit>
                <AdminsActions
                  userTargeted={user}
                  getChannelDatas={props.getChannelDatas}
                  channelData={props.channelData}
                  setBannedOpen={setBannedOpen}
                  setUsersOpen={setUsersOpen}
                />
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
                onClick={handleClickUsers}
                disabled={
                  props.channelData.status !== "owner" &&
                  props.channelData.status !== "admin"
                }
              >
                <ListItemText primary={user.username}></ListItemText>
                {usersOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={usersOpen} timeout="auto" unmountOnExit>
                <AdminsActions
                  userTargeted={user}
                  getChannelDatas={props.getChannelDatas}
                  channelData={props.channelData}
                  setBannedOpen={setBannedOpen}
                  setUsersOpen={setUsersOpen}
                />
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Grid>
      {props.channelData.data.banned &&
        props.channelData.data.banned.length > 0 ? (
        <Grid item>
          <List>
            Banned
            {props.channelData.data.banned.map((user: any) => (
              <ListItem key={user.username}>
                <ListItemButton
                  onClick={handleClickBanned}
                  disabled={
                    props.channelData.status !== "owner" &&
                    props.channelData.status !== "admin"
                  }
                >
                  <ListItemText primary={user.username}></ListItemText>
                  {bannedOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={bannedOpen} timeout="auto" unmountOnExit>
                  <ListItem>
                    <UnbanUser
                      userTargeted={user}
                      getChannelDatas={props.getChannelDatas}
                      channelData={props.channelData}
                      setBannedOpen={setBannedOpen}
                    />
                  </ListItem>
                </Collapse>
              </ListItem>
            ))}
          </List>
        </Grid>
      ) : null}
    </Grid>
  );
}
