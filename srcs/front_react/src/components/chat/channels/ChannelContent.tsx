import { Grid } from '@mui/material'
import React from 'react'
import Conv from '../messages/Conv';
import MessagesList from '../messages/MessagesList'
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
      <Grid item xs={3}>
        <InfosChannels channelData={props.channelData}/>
      </Grid>
    </Grid>
  )
}
