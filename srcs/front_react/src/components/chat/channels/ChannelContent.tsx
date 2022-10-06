import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { api } from '../../../const/const';
import Conv from '../messages/Conv';
import MessagesList from '../messages/MessagesList'
import { IChannel } from '../types';
import AdminsActions from './admins/AdminsActions';
import InfosChannels from './InfosChannels';

interface ChannelContentProps {
  messagesList: any[];
  username: string;
  setCurrentMessage: (message: string) => void;
  sendMessage: () => void;
  channelData: any;
}

export default function ChannelContent(props: ChannelContentProps) {
  const [infosChannel, setInfosChannel] = useState<any>(props.channelData);

  async function getInfosChannel(channel: any) {
    await api
      .get("channel/datas", {
        params: {
          name: channel.name,
        },
      })
      .then((res) => {
        console.log("get infos channels");
        setInfosChannel(res.data);
        //setChannelId(res.data.id);
        console.log(res.data);
      })
      .catch((res) => {
        console.log("invalid channels private data");
      });
    console.log("bbbbb");
  }

  useEffect(() => {
    console.log("aaaaa");
    console.log("channel data", props.channelData);
    getInfosChannel(props.channelData);
    console.log("infos channel", infosChannel);
  }, [props.channelData]);

  if (infosChannel !== props.channelData) {
    return (
      <Grid container>
        <Grid item xs={9}>
        <Conv
            messagesList={props.messagesList}
            //setMessagesList={setMessagesList}
            username={props.username}
            setCurrentMessage={props.setCurrentMessage}
            sendMessage={props.sendMessage}
        />
        </Grid>
       {  /* infosChannel !== undefined && <Grid item xs={3}>
          <InfosChannels channelData={infosChannel}/>
        </Grid>  */}
      </Grid>
    )
  } else {
    return (
    <></>
    )
  }
}
