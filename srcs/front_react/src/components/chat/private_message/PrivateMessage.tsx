import React from 'react'
import { api } from '../../../userlist/UserListItem';
import { IChannel } from '../types';

async function joinMP(channel: IChannel) {
  await api
    .post("channel/joinMP", channel)
    .then((res) => {
      console.log("channel joined with success");
      console.log(channel);
    })
    .catch((res) => {
      console.log("invalid channels");
      console.log(res);
    });
}

function PrivateMessage() {
  return (
    <>PrivateMessage</>
  )
}

export default PrivateMessage