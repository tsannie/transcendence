import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import Conv from "../messages/Conv";
import MessagesList from "../messages/MessagesList";
import { IChannel } from "../types";
import AdminsActions from "./admins/AdminsActions";
import InfosChannels from "./InfosChannels";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ChannelsContext } from "../../../contexts/ChannelsContext";
import { MessagesContext } from "../../../contexts/MessagesContext";
import { UserContext } from "../../../contexts/UserContext";

interface ChannelContentProps {
  getChannelDatas: any;
  channelData: any;
}

export default function ChannelContent(props: ChannelContentProps) {
  const [openMoreInfos, setOpenMoreInfos] = useState(false);
  const { getChannelsUserlist } = useContext(ChannelsContext);

  function handleClick(event: any) {
    console.log("more infos (delete channel)");
    setOpenMoreInfos(!openMoreInfos);
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

  console.log("channel data", props.channelData);

  if (props.channelData !== undefined)
    return (
      <Grid container>
        {props.channelData.status !== "public" && (
          <Grid item xs={9}>
            <Box sx={{ border: "3px solid red" }}>
              <Grid item>
                <Typography variant={"h6"}>
                  {"Channel " + props.channelData.data.name}
                </Typography>
                <Typography variant={"h6"}>
                  {"Created the " + props.channelData.data.createdAt}
                </Typography>
              </Grid>
              {props.channelData.status === "owner" && (
                <Grid item>
                  <IconButton onClick={handleClick}>
                    <MoreHorizIcon />
                  </IconButton>
                  {openMoreInfos && (
                    <Button
                      sx={{
                        color: "red",
                        ml: "1vh",
                      }}
                      onClick={() => deleteChannel(props.channelData)}
                    >
                      Delete
                    </Button>
                  )}
                </Grid>
              )}
            </Box>
            <Conv />
          </Grid>
        )}
        <Grid item xs={3}>
          <InfosChannels
            getChannelDatas={props.getChannelDatas}
            channelData={props.channelData}
          />
        </Grid>
      </Grid>
    );
  return <></>;
}
