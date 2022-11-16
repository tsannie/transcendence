import { Fragment, useEffect, useRef, useState } from "react";
import { User } from "../../contexts/AuthContext";
import { IDatas } from "./Conversation";
import { IChannel } from "./types";

function UserOptions(props: {type: string, credentials: boolean, user: User}) {
    const {credentials, user} = props;
    const [isOpen, setOpen] = useState<boolean>(false);

    const displayOptions = () => {
        return (
        <div className="dropdown">
        </div>);
    }

    return (
    <Fragment>
        <button className="member" onClick={() => setOpen(true)}>
            <img src={user.profile_picture} />
        </button>
        {isOpen ? displayOptions() : null}
    </Fragment>);
}

function UserList( props: {type: string, credentials: boolean, users: User[] | null} ) {
    const {users} = props;
    const userList = users?.map( (member : User) => <UserOptions key={member.id} type={props.type} credentials={props.credentials} user={member}/>)
    
    return (
    <Fragment>
        {userList}
    </Fragment>);
}

function UserCategory(props: {name: string, credentials: boolean, users: User[] | null}) {
    const { users } = props;

    if (!users || users.length === 0)
        return <Fragment/>;

    return (
        <div className="category">
            <div className="title">{props.name}</div>
            <UserList type={props.name} credentials={props.credentials} users={users}/>
        </div>
    )
}

function RequesterOptions(props: {isOwner: boolean, isAdmin: boolean, channel: IChannel}) {
    const {isOwner, isAdmin, channel} = props;
    
    return (
        <Fragment>
            {isOwner ? <UserCategory name={"Admins"} credentials={true} users={channel.admins}/> : <UserCategory name="Admins" credentials={false} users={channel.admins}/>}
            {isOwner || isAdmin ? 
            <Fragment>
                <UserCategory name={"Members"} credentials={true} users={channel.users}/>
                <UserCategory name={"Muted"} credentials={true} users={channel.muted}/>
                <UserCategory name={"Banned"} credentials={true} users={channel.muted}/>
            </Fragment> : 
            <Fragment>
                <UserCategory name={"Members"} credentials={false} users={channel.users}/>
            </Fragment>
            }
        </Fragment>);
}

function ChannelMembers(props: {channel: IDatas | null }) {
    const status = props.channel?.status;
    const data = props.channel?.data;

    if (!data)
        return <Fragment />;

    switch (status){
        case "owner":
            return <RequesterOptions isOwner={true} isAdmin={false} channel={data} />
        case "admin":
            return <RequesterOptions isOwner={false} isAdmin={true} channel={data} />
        default:
            return <RequesterOptions isOwner={false} isAdmin={false} channel={data} />
    }
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

function ChannelOptions(props: {currentConvId: string, channel: IDatas | null}) {
    return <Fragment>
        <ChannelProfile channel={props.channel?.data}/>
        <div className="conversation__options__members">
            <ChannelMembers channel={props.channel} />
        </div>
    </Fragment>
}

export default ChannelOptions;