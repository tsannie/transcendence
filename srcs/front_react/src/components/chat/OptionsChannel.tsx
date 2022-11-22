import { Fragment, useEffect, useRef, useState } from "react";
import { User } from "../../contexts/AuthContext";
import { IDatas } from "./Conversation";
import UserOptions from "./OptionsChannelActions";
import { IChannel } from "./types";

export interface IMemberProps {
    type: string;
    isOwner: boolean;
    isAdmin: boolean;
    channelId: string; 
    user: User;
}

function MemberCategory(props: {type: string, isOwner: boolean, isAdmin: boolean, channelId: string, users: User[] | null}) {
    const { users } = props;

    if (!users || users.length === 0)
        return <Fragment/>;

    const userList = users?.map( (member : User) => <UserOptions key={member.id} user={member} {...props}/>)

    return (
        <div className="category">
            <div className="title">{props.type}</div>
            <div className="users">{userList}</div>
        </div>
    )
}

function ChannelMembers(props: {receivedChannel: IDatas | null }) {
    const status = props.receivedChannel?.status;
    const channel = props.receivedChannel?.data;
    
    return (
        <Fragment>
        { channel ? 
        <div className="conversation__options__members">
            <MemberCategory type={"Admins"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={channel.admins}/>
            <MemberCategory type={"Members"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={channel.users}/>
            {(status === "owner" || status === "admin") ? 
            <Fragment>
                <MemberCategory type={"Muted"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={channel.muted?.map((elem) => elem.user) as User[]}/>
                <MemberCategory type={"Banned"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={channel.banned?.map((elem) => elem.user) as User[]}/>
            </Fragment> : null}
        </div> : null}
        </Fragment>);
}

function ChannelProfile(props: {channel: IChannel|undefined}) {
    const { channel } = props;

    return (
    <div className="conversation__options__title">
        <div className="text"> 
            <span>{channel?.name}</span>
            <div className="date">conv started at: {channel?.createdAt?.toLocaleString()}</div>
            <span className="owner">owned by: {channel?.owner?.username}</span>
            <button className="clickable_profile">
                <img src={channel?.owner?.profile_picture}/>
            </button>
        </div>
  </div>);
}

function ChannelOptions(props: {currentConvId: string, receivedChannel: IDatas | null}) {
    return <Fragment>
        <ChannelProfile channel={props.receivedChannel?.data}/>
        <ChannelMembers receivedChannel={props.receivedChannel} />
    </Fragment>
}

export default ChannelOptions;