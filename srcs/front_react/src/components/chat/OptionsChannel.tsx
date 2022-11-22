import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { User } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
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
    const userList = users?.map( (member : User) => <UserOptions key={member.id} user={member} {...props}/>)

    if (!users || users.length === 0)
        return <Fragment/>;
    else
    {
        return (
            <div className="category">
                <div className="title">{props.type}</div>
                <div className="users">{userList}</div>
            </div>
        )
    }
}

function ChannelMembers(props: {receivedChannel: IDatas}) {
    const status = props.receivedChannel.status;
    const channel = props.receivedChannel.data;
    const { socket } = useContext(MessageContext);
    const [ admins, setAdmins ] = useState<User[] | null>(null);
    const [ users, setUsers ] = useState<User[] | null>(null);
    const [ muted, setMuted ] = useState<User[] | null>(null);
    const [ banned, setBanned ] = useState<User[] | null>(null);

    useEffect( () => {
        if (socket)
        {
            socket.on("mutedUser", (data) => {
                console.log("dans le useEffect", data);
                if (admins)
                    setAdmins( admins.filter((elem => elem.id !== data.user.id)));
                if (users)
                    setUsers( users.filter((elem => elem.id !== data.user.id)));
                if (muted)
                    setMuted([data.user, ...muted] )
                else
                    setMuted([data.user])
            });

            return (() => {
                socket.off("mutedUser");
            })
        };
    }, [muted])

    useEffect( () => {
        setAdmins(channel.admins);
        setUsers(channel.users);
        if (channel.muted)
            setMuted(channel.muted.map((elem) => elem.user));
        if (channel.banned)
            setBanned(channel.banned.map((elem) => elem.user));
    }, [channel])

    return (
        <Fragment>
        { channel ? 
        <div className="conversation__options__members">
            <MemberCategory type={"Admins"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={admins}/>
            <MemberCategory type={"Members"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={users as User[] | null}/>
            <MemberCategory type={"Muted"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={muted as User[] | null}/>
            <MemberCategory type={"Banned"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={banned as User[] | null}/>
        </div> : null}
        </Fragment>);
}

function ChannelProfile(props: {channel: IChannel}) {
    const { channel } = props;

    return (
    <div className="conversation__options__title">
        <div className="text"> 
            <span>{channel.name}</span>
            <div className="date">conv started at: {channel.createdAt.toLocaleString()}</div>
            <span className="owner">owned by: {channel.owner?.username}</span>
            <button className="clickable_profile">
                <img src={channel.owner?.profile_picture}/>
            </button>
        </div>
  </div>);
}

function ChannelOptions(props: {currentConvId: string, receivedChannel: IDatas | null}) {
    if (!props.receivedChannel || !props.receivedChannel.data)
        return <Fragment/>
    else
        return <Fragment>
            <ChannelProfile channel={props.receivedChannel.data}/>
            <ChannelMembers receivedChannel={props.receivedChannel} />
        </Fragment>
}

export default ChannelOptions;