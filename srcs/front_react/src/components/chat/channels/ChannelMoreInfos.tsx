import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { api } from "../../../const/const";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface ChannelMoreInfosProps {
  channelData: any;
  getChannelDatas: any;
}

export default function ChannelMoreInfos(props: ChannelMoreInfosProps) {
  const { getChannelsUserlist } = useContext(ChannelsContext);
  const [openMoreInfos, setOpenMoreInfos] = useState(false);
  const [isModifyPassword, setIsModifyPassword] = useState(false);
  const [isDeletePassword, setIsDeletePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordToDelete, setPasswordToDelete] = useState("");
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
    setIsModifyPassword(false);
    setIsDeletePassword(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function handleClickModifyPassword() {
    setIsModifyPassword(!isModifyPassword);
    setIsDeletePassword(false);
    setPasswordToDelete("");
  }

  function handleClickDeletePassword() {
    setIsDeletePassword(!isDeletePassword);
    setIsModifyPassword(false);
    setCurrentPassword("");
    setNewPassword("");
  }

  async function deleteChannel(channelName: string) {

    const newChannel = {
      name: channelName,
    }
    console.log("channel name in delete = ", newChannel);
    await api
      .post("channel/delete", newChannel)
      .then((res) => {
        console.log("channel deleted with success");
        getChannelsUserlist();
      })
      .catch((res) => {
        console.log("invalid delete channel");
        console.log(res);
      });
    setOpenMoreInfos(false);
  }

  async function modifyPassword(channel: any) {
    // name, current password, new password
    console.log("channel status = ", channel.data.status);
    const newChannel = {
      name: channel.data.name,
      current_password: channel.data.status === "Protected" ? currentPassword : undefined,
      new_password: newPassword,
    };
    console.log(" new channel = ", newChannel);
    await api
      .post("channel/modifyPassword", newChannel)
      .then((res) => {
        console.log("password modify with success");
        console.log(channel);
        props.getChannelDatas(channel.data.name);
      })
      .catch((res) => {
        console.log("invalid modify password");
        console.log(res);
      });
    setOpenMoreInfos(false);
    setCurrentPassword("");
    setNewPassword("");
  }

  async function deletePassword(channel: any) {
    const newChannel = {
      name: channel.data.name,
      password: passwordToDelete,
    }

    console.log(channel);
    await api
      .post("channel/deletePassword", newChannel)
      .then((res) => {
        console.log("password deleted with success");
        console.log(channel);
        props.getChannelDatas(channel.data.name);
      })
      .catch((res) => {
        console.log("invalid delete password");
        console.log(res);
      });
    setOpenMoreInfos(false);
    setPasswordToDelete("");
  }

  console.log("channel data = ", props.channelData);

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
              onClick={() => deleteChannel(props.channelData.data.name)}
            >
              Delete Channel
            </ListItemButton>
            <ListItemButton
              sx={{
                color: "green",
                ml: "1vh",
              }}
              onClick={() => handleClickModifyPassword()}
            >
              {props.channelData.data.status === "Protected" ? "Modify Password" : "Add Password"}
            </ListItemButton>
            <>
              {props.channelData.data.status === "Protected" && (
                <TextField
                  sx={{
                    display: isModifyPassword ? "block" : "none",
                  }}
                  placeholder="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                  }}
                ></TextField>
              )}
              <TextField
                sx={{
                  display: isModifyPassword ? "block" : "none",
                }}
                placeholder="newpassword"
                type="password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }}
              ></TextField>

              {isModifyPassword && (
                <Button
                  onClick={() => modifyPassword(props.channelData)}
                  sx={{ right: 0 }}
                  variant="contained"
                >
                  Submit
                </Button>
              )}
            </>
            {props.channelData.data.status === "Protected" && (
              <ListItemButton
                sx={{
                  color: "blue",
                  ml: "1vh",
                }}
                onClick={() => handleClickDeletePassword()}
              >
                Delete Password
              </ListItemButton>
            )}
            {props.channelData.data.status === "Protected" && (
              <ListItem>
                <TextField
                  sx={{
                    display: isDeletePassword ? "block" : "none",
                  }}
                  placeholder="oldpassword"
                  type="password"
                  value={passwordToDelete}
                  onChange={(event) => {
                    setPasswordToDelete(event.target.value);
                  }}
                ></TextField>
                {isDeletePassword && (
                  <Button
                    onClick={() => deletePassword(props.channelData)}
                    sx={{ right: 0 }}
                    variant="contained"
                  >
                    Submit
                  </Button>
                )}
              </ListItem>
            )}
          </List>
        )}
      </Popover>
    </div >
  );
}
