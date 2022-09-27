import { Button, List, ListItem, ListItemButton, Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { IChannel } from "../types";
import BanUser from "./BanUser";
import MakeAdmin from "./MakeAdmin";
import MuteUser from "./MuteUser";
import RevokeAdmin from "./RevokeAdmin";
import UnbanUser from "./UnbanUser";
import UnmuteUser from "./UnmuteUser";

export default function AdminsActions(props: any) {
  const [infosChannel, setInfosChannel] = useState<IChannel>();

  // handleAdminActionsClick function to open popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    props.getChannels();
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function isAdmin(channel: any) {
    if (channel !== undefined) {
      for (let i = 0; i < channel.admins.length; i++) {
        if (channel.admins[i].id === props.userId) {
          return true;
        }
      }
    }
    return false;
  }

  async function getInfosChannel(channel: IChannel) {
    if (props.isOwner(channel)) {
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
  }

  useEffect(() => {
    getInfosChannel(props.channelData);
  }, [props.channelData]);

  // TODO unmute unban btn

  return (
    <>
      {isAdmin(infosChannel) || props.isOwner(props.channelData) ? (
        <div>
          <Button
            //aria-describedby={id}
            //variant="contained"
            onClick={handleClick}
          >
            Admin Actions
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <List>
              <ListItem>
                <BanUser infosChannel={infosChannel} getChannels={props.getChannels}/>
              </ListItem>
              <ListItem>
                <UnbanUser infosChannel={infosChannel} getChannels={props.getChannels}/>
              </ListItem>
              <ListItem>
                <MuteUser infosChannel={infosChannel} getChannels={props.getChannels} userId={props.userId} />
              </ListItem>
              <ListItem>
                <UnmuteUser infosChannel={infosChannel} getChannels={props.getChannels}/>
              </ListItem>
              <ListItem>
                <MakeAdmin infosChannel={infosChannel} getChannels={props.getChannels} isAdmin={isAdmin}/>
              </ListItem>
              <ListItem>
                <RevokeAdmin infosChannel={infosChannel} getChannels={props.getChannels}/>
              </ListItem>
            </List>
          </Popover>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
