import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { AuthContext, User } from "../../contexts/AuthContext";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { IChannel, IDm } from "./types";
import {ReactComponent as UserIcon} from "../../assets/img/icon/user.svg";
import {ReactComponent as BlockIcon} from "../../assets/img/icon/no_waiting_sign.svg";

function DmUserProfile(props: {dm: IDm | IChannel}) {
  const { user } = useContext(AuthContext);
  const dm = props.dm;
  const user2 = dm?.users?.find( (elem) => elem.id !== user?.id)  

  return (
  <div className="conversation__options__title">
    <img src={user2?.profile_picture} />
    <div className="text"> 
      <span>{user2?.username}</span>
      <div className="date">conv started at: {dm?.createdAt?.toLocaleString()}</div>
    </div>
    <div className="actions">
      <button><UserIcon />Profile</button>
      <button><BlockIcon />Block</button>
    </div>
  </div>);
}

function DmOptions(props: {currentConvId: string, dm: IDm | IChannel}) {
  const {dm} = props;

  return <Fragment>
      <DmUserProfile dm={dm}/>
    </Fragment>
}

function ChannelOptions(props: {currentConvId: string, channel: IDm | IChannel}) {
  return <Fragment></Fragment>
}

function Options(props: {currentConvId: string, isChannel: boolean, data: IDm| IChannel}) {
  const {currentConvId, isChannel, data} = props;

  return (
    <div className="conversation__options">
      {isChannel? <ChannelOptions currentConvId={currentConvId} channel={data} /> : <DmOptions currentConvId={currentConvId} dm={data}/>}
    </div>
  );
}

export default Options;
