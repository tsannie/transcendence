import { Fragment } from "react";
import { User } from "../../contexts/AuthContext";
import { IDatas } from "./Conversation";
import UserOptions from "./OptionsChannelActions";
import { IChannel } from "./types";



function MemberCategory(props: {name: string, isOwner: boolean, isAdmin: boolean, users: User[] | null}) {
    const { users } = props;

    if (!users || users.length === 0)
        return <Fragment/>;

    const userList = users?.map( (member : User) => <UserOptions key={member.id} type={props.name} isOwner={props.isOwner} isAdmin={props.isAdmin} user={member}/>)

    return (
        <div className="category">
            <div className="title">{props.name}</div>
            {userList}
        </div>
    )
}

function ChannelMembers(props: {receivedChannel: IDatas | null }) {
    const status = props.receivedChannel?.status;
    const channel = props.receivedChannel?.data;
    
    if (!channel)
        return <Fragment />;

    return (
        <div className="conversation__options__members">
            <MemberCategory name={"Admins"} isOwner={status === "owner"} isAdmin={status === "admin"} users={channel.admins}/>
            <MemberCategory name={"Members"} isOwner={status === "owner"} isAdmin={status === "admin"} users={channel.users}/>
            {(status === "owner" || status === "admin") ? 
            <Fragment>
                <MemberCategory name={"Muted"} isOwner={status === "owner"} isAdmin={status === "admin"} users={channel.muted}/>
                <MemberCategory name={"Banned"} isOwner={status === "owner"} isAdmin={status === "admin"} users={channel.muted}/>
            </Fragment> : null}
        </div>);
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