import { Button, List, ListItemButton } from "@mui/material";
import React, { useState } from "react";
import { api } from "../../../userlist/UserListItem";
import { IChannel } from "../types";

export default function AdminsActions(props: any) {
  const [targetUsername, setTargetUsername] = useState("");

  function createChannelActions(channel: IChannel) {
    console.log("channel = ", channel);
    const newChannel = {
      name: channel.name,
      targetUsername: targetUsername,
    };
    console.log(newChannel);

    return newChannel;
  }

  // create function who display the list of users and setTargetUsername to the user clicked

  function listUsers(users: any) {
    console.log("users = ", users);

    return (
      <List>
        {users.map((user: any) => (
          <ListItemButton onClick={() => setTargetUsername(user.username)}>
            {user.username}
          </ListItemButton>
        ))}
      </List>
    );
  }

  async function muteChannel(channel: IChannel) {
    listUsers(channel.users);
    console.log("targetUsername = ", targetUsername);
    const newChannel = createChannelActions(channel);

    if (newChannel.targetUsername !== "") {
      await api
        .post("channel/muteUser", newChannel)
        .then((res) => {
          console.log("channel left with success");
          console.log(channel);
        })
        .catch((res) => {
          console.log("invalid channels");
          console.log(res);
        });
    }
  }

  async function banChannel(channel: IChannel) {
    listUsers(channel.users);
    const newChannel = createChannelActions(channel);

    if (newChannel.targetUsername !== "") {
      await api
        .post("channel/banUser", newChannel)
        .then((res) => {
          console.log("channel left with success");
          console.log(channel);
        })
        .catch((res) => {
          console.log("invalid channels");
          console.log(res);
        });
    }
  }

  return (
    <div>
      <Button
        sx={{
          color: "black",
          ml: "1vh",
        }}
        onClick={() => muteChannel(props.channelData)}
      >
        Mute
      </Button>
      <Button
        sx={{
          color: "black",
          ml: "1vh",
        }}
        onClick={() => banChannel(props.channelData)}
      >
        Ban
      </Button>
    </div>
  );
}
