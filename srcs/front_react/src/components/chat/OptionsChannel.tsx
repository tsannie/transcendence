import { Fragment, useEffect, useRef, useState } from "react";
import { User } from "../../contexts/AuthContext";
import { IDatas } from "./Conversation";
import { IChannel } from "./types";

function UserOptions(props: {type: string, isOwner: boolean, isAdmin: boolean, user: User}) {
    const {type, isOwner, isAdmin, user} = props;
    const [isOpen, setOpen] = useState<boolean>(false);
    
    const adminOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isOwner){    
            adminOptionsJSX.push(<button>Ban User</button>);
            adminOptionsJSX.push(<button>Mute User</button>);
            adminOptionsJSX.push(<button>Revoke Admin</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>
    }

    const memberOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin){    
            adminOptionsJSX.push(<button>Ban User</button>);
            adminOptionsJSX.push(<button>Mute User</button>);
        }
        if (isOwner)
            adminOptionsJSX.push(<button>Make Admin</button>)
        return <Fragment>{adminOptionsJSX}</Fragment>
    }

    const mutedOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){    
            adminOptionsJSX.push(<button>Unmute User</button>);
            adminOptionsJSX.push(<button>Ban User</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>
    }

    const bannedOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){    
            adminOptionsJSX.push(<button>UnBan User</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>
    }

    const displayOptions = () => {
        return (
        <div className="dropdown">
            <div className="options">Options</div>
            <button>Access Profile</button>
            {type === "Admins" && adminOptions()}
            {type === "Members" && memberOptions()}
            {type === "Muted" && mutedOptions()}
            {type === "Banned" && bannedOptions()}
        </div>);
    }

    return (
    <Fragment>
        <button className="member" onClick={(e: any) => {console.log(e); setOpen(true);}}>
            <img src={user.profile_picture} />
        </button>
        {isOpen ? displayOptions() : null}
    </Fragment>);
}

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