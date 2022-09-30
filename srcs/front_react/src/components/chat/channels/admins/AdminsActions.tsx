import { Button, List, ListItem, Popover } from "@mui/material";
import React, { useState } from "react";
import { api } from "../../../../userlist/UserList";
import { IChannel } from "../../types";
import BanUser from "./BanUser";
import MakeAdmin from "./MakeAdmin";
import MuteUser from "./MuteUser";
import RevokeAdmin from "./RevokeAdmin";
import UnbanUser from "./UnbanUser";
import UnmuteUser from "./UnmuteUser";

interface AdminsActionsProps {
  channelData: IChannel;
  userId: number;
  getChannels: () => void;
  isOwner: (channel: any) => boolean;
}

export default function AdminsActions(props: AdminsActionsProps) {
  const [infosChannel, setInfosChannel] = useState({});

  // handleAdminActionsClick function to open popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    getInfosChannel(props.channelData);
    props.getChannels();
  }

  function handleClose() {
    setAnchorEl(null);
  }

  // create a function isAdmin to check if the user is admin
  function isAdmin(channel: any, id: number) {
    if (channel !== undefined) {
      for (let i = 0; i < channel.admins.length; i++) {
        if (channel.admins[i].id === id) {
          return true;
        }
      }
    }
    return false;
  }

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
        //console.log(res.data);
        //setChannelId(res.data.id);
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
  }

  return (
    <>
      {isAdmin(infosChannel, props.userId) || props.isOwner(props.channelData) ? (
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
                <BanUser infosChannel={infosChannel} getInfosChannel={getInfosChannel}/>
              </ListItem>
              <ListItem>
                <UnbanUser infosChannel={infosChannel} getInfosChannel={getInfosChannel} />
              </ListItem>
              <ListItem>
                <MuteUser infosChannel={infosChannel} getInfosChannel={getInfosChannel} userId={props.userId} />
              </ListItem>
              <ListItem>
                <UnmuteUser infosChannel={infosChannel} getInfosChannel={getInfosChannel} />
              </ListItem>
              <ListItem>
                <MakeAdmin infosChannel={infosChannel} getInfosChannel={getInfosChannel} isAdmin={isAdmin} />
              </ListItem>
              <ListItem>
                <RevokeAdmin infosChannel={infosChannel} getInfosChannel={getInfosChannel}/>
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
