import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Popover,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { api } from "../../../const/const";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface ChannelMoreInfosProps {
  channelData: any;
}

export default function ChannelMoreInfos(props: ChannelMoreInfosProps) {
  const { getChannelsUserlist } = useContext(ChannelsContext);
  const [openMoreInfos, setOpenMoreInfos] = useState(false);
  const [isModifyPassword, setIsModifyPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenMoreInfos(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function handleClickModifyPassword() {
    setIsModifyPassword(!isModifyPassword);
  }

  function joinNewChannelWithoutStatus(channel: any) {
    const newChannel = {
      name: channel.data.name,
    };
    console.log(newChannel);

    return newChannel;
  }

  async function deleteChannel(channel: any) {
    const newChannel = joinNewChannelWithoutStatus(channel);

    console.log(channel);
    await api
      .post("channel/delete", newChannel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
        getChannelsUserlist();
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
    setOpenMoreInfos(false);
  }

  async function modifyPassword(channel: any) {
    // name, current password, new password
    const newChannel = {
      name: channel.data.name,
      current_password: channel.data.password,
      new_password: newPassword,
    };

    console.log(" new channel = ", newChannel);
    await api
      .post("channel/modify", newChannel)
      .then((res) => {
        console.log("channel left with success");
        console.log(channel);
        getChannelsUserlist();
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
    setOpenMoreInfos(false);
    setNewPassword("");
  }

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {openMoreInfos && (
          <List>
            <ListItemButton
              sx={{
                color: "red",
                ml: "1vh",
              }}
              onClick={() => deleteChannel(props.channelData)}
            >
              Delete
            </ListItemButton>
            <ListItemButton
              sx={{
                color: "green",
                ml: "1vh",
              }}
              onClick={() => handleClickModifyPassword()}
            >
              Modify Password
            </ListItemButton>
            <ListItem

            >
              <TextField
                sx={{
                  minWidth: "15vw",
                  display: isModifyPassword ? "block" : "none",
                  ml: 2,
                }}
                placeholder="password"
                type="password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }}
              ></TextField>

              {isModifyPassword && (
                <Button
                  onClick={() => modifyPassword(props.channelData)}
                  sx={{ right: 0, position: "absolute", mr: 10 }}
                >
                  Submit
                </Button>
              )}
            </ListItem>
          </List>
        )}
      </Popover>
    </div>
  );
}
