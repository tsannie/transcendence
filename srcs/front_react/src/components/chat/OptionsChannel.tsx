import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext, User } from "../../contexts/AuthContext";
import { ChatDisplayContext, ChatType } from "../../contexts/ChatDisplayContext";
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

function ChannelMembers(props: {receivedChannel: IDatas, currentConvId: string}) {
    const loadedStatus = props.receivedChannel.status;
    const channel = props.receivedChannel.data;
    const { socket } = useContext(MessageContext);
    const { user } = useContext(AuthContext);

    const [ status, setStatus ] = useState<string | null>(null);
    const [ admins, setAdmins ] = useState<User[] | null>(null);
    const [ users, setUsers ] = useState<User[] | null>(null);
    const [ muted, setMuted ] = useState<User[] | null>(null);
    const [ banned, setBanned ] = useState<User[] | null>(null);

    const filterList = (list: User[]| null, target: User) => {
        if (!list)
            return null;
        return list.filter(user => user.id != target.id);
    }

    const addToList = (list: User[] | null, target: User) => {
        if (!list)
            return [target];
        else
            return [...list, target];
    }

    useEffect( () => {
        if (socket)
        {
            socket.on("muteUser", (target, channelId) => {
                if (channelId === props.currentConvId){
                    setAdmins(filterList(admins, target));
                    setUsers(filterList(users, target));
                    setMuted(addToList(muted, target));
                }
                if (user?.id === target.id)
                    setStatus("user");
            });
            socket.on("unMuteUser", (target, channelId) => {
                if (channelId === props.currentConvId){
                    setUsers(addToList(users, target));
                    setMuted(filterList(muted, target));
                }
                if (user?.id === target.id)
                    setStatus("user");
            });
            socket.on("banUser", (target, channelId) => {
                if (channelId === props.currentConvId) {
                    setAdmins(filterList(admins, target));
                    setUsers(filterList(users, target));
                    setMuted(filterList(muted, target));
                    setBanned(addToList(banned, target));
                }
                if (user?.id === target.id)
                    setStatus("user");
            });
            socket.on("unBanUser", (target, channelId) => {
                if (channelId === props.currentConvId) {
                    setBanned(filterList(banned, target));
                }
                if (user?.id === target.id)
                    setStatus("user");
            });
            socket.on("makeAdmin", (target, channelId) => {
                if (channelId === props.currentConvId) {
                    setAdmins(addToList(admins, target));
                    setUsers(filterList(users, target));
                }
                if (user?.id === target.id)
                    setStatus("admin");
            });
            socket.on("revokeAdmin", (target, channelId) => {
                if (channelId === props.currentConvId) {
                    setAdmins(filterList(admins, target));
                    setUsers(addToList(users, target));
                }
                if (user?.id === target.id)
                    setStatus("user");
            });
            socket.on("joinChannel", (channel, target) => {
                setUsers(addToList(users, target));
            });

        return (() => {
            socket.off("muteUser");
            socket.off("unMuteUser");
            socket.off("makeAdmin");
            socket.off("revokeAdmin");
            socket.off("banUser");
            socket.off("unBanUser");
            socket.off("joinChannel");
        })}
    }, [muted, users, banned, admins, socket])

    useEffect( () => {
        if (channel.id !== props.currentConvId)
            return;
        let muted: User[] = [];

        setStatus(loadedStatus);
        setAdmins(channel.admins);
        if (channel.banned)
            setBanned(channel.banned.map((elem) => elem.user));

        if (channel.muted){
            muted = channel.muted.map((elem) => elem.user);
            setMuted(muted);
        }
        if (channel.users){
            let mutedIds : string[];

            if (muted.length != 0)
            {
                mutedIds = muted.map(elem => elem.id);
                setUsers(channel.users.filter( elem => !mutedIds.includes(elem.id)));
            }
            else
                setUsers(channel.users);
        }

    }, [channel])

    return (
        <Fragment>
            { channel ?
            <div className="conversation__options__members" key={props.currentConvId}>
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
                <Link style={{textDecoration: 'none'}} to={"/profile/" + channel.owner?.username}>
                    <img src={channel.owner?.profile_picture}/>
                </Link>
            </button>
        </div>
  </div>);
}

function ChannelOptions(props: {currentConvId: string, receivedChannel: IDatas | null}) {
    if (!props.receivedChannel || !props.receivedChannel.data)
        return <Fragment/>
    else
        return <Fragment>
            <ChannelProfile channel={props.receivedChannel.data} />
            <ChannelMembers receivedChannel={props.receivedChannel} currentConvId={props.currentConvId} />
        </Fragment>
}

export default ChannelOptions;