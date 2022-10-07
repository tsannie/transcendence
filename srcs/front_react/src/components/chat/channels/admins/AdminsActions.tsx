import { Button, List, ListItem, Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../../../const/const";
import { IChannel } from "../../types";
import BanUser from "./BanUser";
import MakeAdmin from "./MakeAdmin";
import MuteUser from "./MuteUser";
import RevokeAdmin from "./RevokeAdmin";
import UnbanUser from "./UnbanUser";
import UnmuteUser from "./UnmuteUser";

interface AdminsActionsProps {
  channelData: IChannel;
  getChannels: () => void;
  setUserStatus: (userStatus: string) => void;
}

export default function AdminsActions(props: AdminsActionsProps) {
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

  return (
    <>
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
              <BanUser
                channelData={props.channelData}
              />
            </ListItem>
            {/* <ListItem>
              <UnbanUser
                channelData={props.channelData}
              />
            </ListItem>
            <ListItem>
              <MuteUser
                channelData={props.channelData}
              />
            </ListItem>
            <ListItem>
              <UnmuteUser
                channelData={props.channelData}
              />
            </ListItem>
            <ListItem>
              <MakeAdmin
                channelData={props.channelData}
              />
            </ListItem>
            <ListItem>
              <RevokeAdmin
                channelData={props.channelData}
              />
            </ListItem> */}
          </List>
        </Popover>
      </div>
    </>
  );
}
