import userEvent from "@testing-library/user-event";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../const/const";
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

function ChannelMembers(props: {receivedChannel: IDatas, currentConvId: string, owner: User | null, setOwner: React.Dispatch<React.SetStateAction<User | null>>}) {
    const loadedStatus = props.receivedChannel.status;
    const channel = props.receivedChannel.data;
    const { socket, chatList, setChatList } = useContext(MessageContext);
    const { user } = useContext(AuthContext);

    const [ status, setStatus ] = useState<string | null>(null);
    const [ admins, setAdmins ] = useState<User[] | null>(null);
    const [ users, setUsers ] = useState<User[] | null>(null);
    const [ muted, setMuted ] = useState<User[] | null>(null);
    const [ banned, setBanned ] = useState<User[] | null>(null);
    const { setDisplay } = useContext(ChatDisplayContext);

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
                if (user?.id === target.id) {
                    setChatList(chatList.filter(chat => chat.id !== channelId));
                    setDisplay(ChatType.EMPTY);
                    setStatus("user");
                }
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
            socket.on("joinChannel", (target, channelId) => {
                if (channelId === props.currentConvId) {
                    setUsers(addToList(users, target));
                }
            });
            socket.on("leaveChannel", (target, channelId, channelOwner) => {
                const oldOwner = props.owner;
                /* if (channelId === props.currentConvId) {
                    let usersCpy = users;
                    setUsers(filterList(usersCpy, target));
                    // set chat list only for user who leave the channel
                    if (user?.id === target.id) {
                        setChatList(chatList.filter(chat => chat.id !== channelId));
                        setDisplay(ChatType.EMPTY);
                    }
                    if (channelOwner.id !== props.owner?.id) {
                        props.setOwner(channelOwner);
                        // if owner leave the channel, and there is more users, make the first user
                    }
                    if (user && target.id === props.owner?.id) {
                        setStatus("owner");

                        setUsers(filterList(usersCpy, user));
                        setAdmins(filterList(admins, user));
                    }

                } */
                if (channelId === props.currentConvId) {
                    let newUsers : User[] | null = users;
                    let newAdmins: User[] | null = admins;

                    if (user && user.id === target?.id){
                        setChatList(chatList.filter(chat => chat.id !== channelId));
                        setDisplay(ChatType.EMPTY);
                    }
                    if (user && target?.id === oldOwner?.id) {
                        props.setOwner(channelOwner);
                        newUsers = filterList(users, channelOwner);
                        newAdmins = filterList(admins, channelOwner);
                    }
                    if (user && user.id === channelOwner.id) {
                        setStatus("owner");
                        newUsers = filterList(users, channelOwner);
                        newAdmins = filterList(admins, channelOwner);
                    }
                    setUsers(filterList(newUsers, target));
                    setAdmins(filterList(newAdmins, target));
                }
            });
            socket.on("deleteChannel", (channelId) => {
                setChatList(chatList.filter(chat => chat.id !== channelId));
                setDisplay(ChatType.EMPTY);
            });

        return (() => {
            socket.off("muteUser");
            socket.off("unMuteUser");
            socket.off("makeAdmin");
            socket.off("revokeAdmin");
            socket.off("banUser");
            socket.off("unBanUser");
            socket.off("joinChannel");
            socket.off("leaveChannel");
            socket.off("deleteChannel");
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
        <div className="conversation__options__members" key={props.currentConvId} onClick={ (e) =>{ console.log("bubble2 =", (e.target as HTMLElement).getBoundingClientRect()); console.log((e.target as HTMLElement).getBoundingClientRect().top, (e.target as HTMLElement).getBoundingClientRect().left)}}>
            <MemberCategory type={"Admins"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={admins}/>
            <MemberCategory type={"Members"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={users as User[] | null}/>
            <MemberCategory type={"Muted"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={muted as User[] | null}/>
            <MemberCategory type={"Banned"} isOwner={status === "owner"} isAdmin={status === "admin"} channelId={channel.id} users={banned as User[] | null}/>
        </div> : null}
        </Fragment>);
}

function ChannelProfile(props: {channel: IChannel, owner: User | null}) {
    const { channel, owner } = props;
    const { user } = useContext(AuthContext);

    const leaveChannel = async () => {
        await api
        .post("/channel/leave", { id: channel.id })
        .then(() => toast.success(`${user?.username} left ${channel.name}`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const deleteChannel = async () => {
        await api
        .post("/channel/delete", { id: channel.id })
        .then(() => toast.success(`${user?.username} delete ${channel.name}`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    return (
    <div className="conversation__options__title">
        <div className="text">
            <span>{channel.name}</span>
            <div className="date">conv started at: {channel.createdAt.toLocaleString()}</div>
            <span className="owner">owned by: {owner?.username}</span>
            <button className="clickable_profile">
                <Link to={"/profile/" + owner?.username}>
                    <img src={owner?.profile_picture}/>
                </Link>
            </button>
            <div className="actions-channel">
                <button className="leave-channel" onClick={leaveChannel}>
                    Leave
                </button>
                { owner?.id === user?.id &&
                    <button className="delete-channel" onClick={deleteChannel}>
                        Delete
                    </button>
                }
            </div>
        </div>
  </div>);
}

function ChannelOptions(props: {currentConvId: string, receivedChannel: IDatas | null}) {
    const [ owner, setOwner ] = useState<User | null>(null);

    useEffect(() => {
        if (props.receivedChannel?.data.owner)
            setOwner(props.receivedChannel.data.owner);
    }, [props.receivedChannel])

    if (!props.receivedChannel || !props.receivedChannel.data)
        return <Fragment/>
    else
        return <Fragment>
            <ChannelProfile channel={props.receivedChannel.data} owner={owner} />
            <ChannelMembers receivedChannel={props.receivedChannel} currentConvId={props.currentConvId} owner={owner} setOwner={setOwner}/>
        </Fragment>
}

export default ChannelOptions;