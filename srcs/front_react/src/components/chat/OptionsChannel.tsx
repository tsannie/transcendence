import { channel } from "diagnostics_channel";
import { Fragment } from "react";
import { User } from "../../contexts/AuthContext";
import { IDatas } from "./Conversation";
import { IChannel } from "./types";

/* 
    TODO:
    <Admins>
    <Members>
    <Banned>
    <Muted>
*/

function Muted (props: {credentials: boolean, users: User[] | null}) {
    const { credentials, users } = props;
    
    if (!users || users.length === 0)
        return <Fragment/>;
    
    const membersList = users.map( (elem) => {
        return (
            <button className="members" key={elem.id}>
                <img src={elem.profile_picture}/>
            </button>)
    })
    
    return (
        <div className="category">
            <div className="title">Muted:</div>
            {membersList}
        </div>
    )
}

function Banned(props: {credentials: boolean, users: User[] | null}) {
    const { credentials, users } = props;
    
    if (!users || users.length === 0)
        return <Fragment/>;
    
    const membersList = users.map( (elem) => {
        return (
            <button className="members" key={elem.id}>
                <img src={elem.profile_picture}/>
            </button>)
    })
    
    return (
        <div className="category">
            <div className="title">Banned</div>
            {membersList}
        </div>
    )
}

function Members(props: {credentials: boolean, users: User[] | null}) {
    const { credentials, users } = props;
    
    if (!users || users.length === 0)
        return <Fragment/>;
    
    const membersList = users.map( (elem) => {
        return (
            <button className="members" key={elem.id}>
                <img src={elem.profile_picture}/>
            </button>)
    })
    
    return (
        <div className="category">
            <div className="title">Members</div>
            {membersList}
        </div>
    )
}

function Admins(props: {credentials: boolean, users: User[] | null}) {
    const { credentials, users } = props;
    
    if (!users || users.length === 0)
        return <Fragment/>;
    
    const adminsList = users.map( (elem) => {
        return (
            <button className="members" key={elem.id}>
                <img src={elem.profile_picture}/>
            </button>);
    })
    
    return (
        <div className="category">
            <div className="title">Admins</div>
            {adminsList}
        </div>
    )
}

function ClearedUserOptions(props: {isOwner: boolean, channel: IChannel}) {
    const {isOwner, channel} = props;
    
    return (
        <Fragment>
            {isOwner? <Admins credentials={true} users={channel.admins}/> : <Admins credentials={false} users={channel.admins}/>}
            <Members credentials={true} users={channel.users}/>
            <Banned credentials={true} users={channel.banned}/>
            <Muted credentials={true} users={channel.muted}/>
        </Fragment>);
}

function RegularUserOptions( props: {channel: IChannel}) {
    const {channel} = props;

    return (
        <Fragment>
            <Admins credentials={false} users={channel.admins} />
            <Members credentials={false} users={channel.users}/>
        </Fragment>);
}

function ChannelMembers(props: {channel: IDatas | null }) {
    const status = props.channel?.status;
    const data = props.channel?.data;

    if (!data)
        return <Fragment />;
    
    switch (status){
        case "owner":
            return <ClearedUserOptions isOwner={true} channel={data} />
        case "admin":
            return <ClearedUserOptions isOwner={false} channel={data} />
        default:
            return <RegularUserOptions channel={data} />
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