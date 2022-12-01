import userEvent from "@testing-library/user-event";
import {
  ChangeEvent,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { AuthContext, User } from "../../contexts/AuthContext";
import {
  ChatDisplayContext,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { MessageContext } from "../../contexts/MessageContext";
import { IDatas } from "./Conversation";
import UserOptions from "./OptionsChannelActions";
import { IChannel } from "./types";
import { ReactComponent as LeaveIcon } from "../../assets/img/icon/circle_minus.svg";
import { ReactComponent as DeleteIcon } from "../../assets/img/icon/circle_remove.svg";
import { ReactComponent as PlusIcon } from "../../assets/img/icon/circle_plus.svg";
import { ReactComponent as LockIcon } from "../../assets/img/icon/lock.svg";
import { ReactComponent as EditIcon } from "../../assets/img/icon/edit.svg";
import { ReactComponent as VerifIcon } from "../../assets/img/icon/check.svg";
import { AxiosResponse } from "axios";
import ChannelPassword from "./OptionsChannelPassword";
import SearchBarPlayerInvitation from "./SearchBarPlayerInvitation";

export interface IMemberProps {
  type: string;
  isOwner: boolean;
  isAdmin: boolean;
  channelId: string;
  user: User;
}

function MemberCategory(props: {
  type: string;
  isOwner: boolean;
  isAdmin: boolean;
  channelId: string;
  users: User[] | null;
}) {
  const { users } = props;
  const userList = users?.map((member: User) => (
    <UserOptions key={member.id} user={member} {...props} />
  ));

  if (!users || users.length === 0) return <Fragment />;
  else {
    return (
      <div className="category">
        <div className="title">{props.type}</div>
        <div className="users">{userList}</div>
      </div>
    );
  }
}

function ChannelMembers(props: {receivedChannel: IDatas, currentConvId: string, owner: User | null, setOwner: React.Dispatch<React.SetStateAction<User | null>>}) {
    const loadedStatus = props.receivedChannel.status;
    const channel = props.receivedChannel.data;

    const { setMuted, setMuteDate, setDisplay } = useContext(ChatDisplayContext);
    const { socket, chatList, setChatList } = useContext(MessageContext);
    const { user } = useContext(AuthContext);

    const [ status, setStatus ] = useState<string | null>(null);
    const [ admins, setAdmins ] = useState<User[] | null>(null);
    const [ users, setUsers ] = useState<User[] | null>(null);
    const [ mutedMembers, setMutedMembers ] = useState<User[] | null>(null);
    const [ banned, setBanned ] = useState<User[] | null>(null);

  const filterList = (list: User[] | null, target: User) => {
    if (!list) return null;
    return list.filter((user) => user.id != target.id);
  };

  const addToList = (list: User[] | null, target: User) => {
    if (!list) return [target];
    else return [...list, target];
  };

    useEffect( () => {
        if (socket)
        {
            socket.on("muteUser", (target, channelId, end) => {
                if (channelId === props.currentConvId){
                    setAdmins(filterList(admins, target));
                    setUsers(filterList(users, target));
                    setMutedMembers(addToList(mutedMembers, target));
                }
                if (user?.id === target.id){
                    setStatus("user");
                    setMuted(true);
                    if (end)
                        setMuteDate(end);
                }
            });
            socket.on("unMuteUser", (target, channelId) => {
                if (channelId === props.currentConvId){
                    setUsers(addToList(users, target));
                    setMutedMembers(filterList(mutedMembers, target));

                    if (user?.id === target.id) {
                      setMuted(false);
                      setMuteDate(null);
                    }
                }
                if (user?.id === target.id)
                    setStatus("user");
            });
            socket.on("banUser", (target, channelId) => {
                if (channelId === props.currentConvId) {
                    setAdmins(filterList(admins, target));
                    setUsers(filterList(users, target));
                    setMutedMembers(filterList(mutedMembers, target));
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
            socket.on("joinChannel", (target, isMuted, channelId) => {
                if (channelId === props.currentConvId) {
                    if (isMuted)
                      setMutedMembers(addToList(mutedMembers, target));
                    else
                      setUsers(addToList(users, target));
                }
            });
            socket.on("leaveChannel", (target, channelId, channelOwner) => {
                const oldOwner = props.owner;

        if (channelId === props.currentConvId) {
          let newUsers: User[] | null = users;
          let newAdmins: User[] | null = admins;

          if (user && user.id === target?.id) {
            setChatList(chatList.filter((chat) => chat.id !== channelId));
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
          setMutedMembers(filterList(mutedMembers, target));
        }
      });
      socket.on("deleteChannel", (channelId) => {
        setChatList(chatList.filter((chat) => chat.id !== channelId));
        if (channelId === props.currentConvId) {
          setDisplay(ChatType.EMPTY);
        }
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
    }, [mutedMembers, users, banned, admins, socket])

  useEffect(() => {
    if (channel.id !== props.currentConvId) return;
    let muted: User[] = [];

    setStatus(loadedStatus);
    setAdmins(channel.admins);
    if (channel.banned) setBanned(channel.banned.map((elem) => elem.user));

        if (channel.muted){
            muted = channel.muted.map((elem) => elem.user);
            setMutedMembers(muted);
        }
        if (channel.users){
            let mutedIds : string[];

      if (muted.length != 0) {
        mutedIds = muted.map((elem) => elem.id);
        setUsers(channel.users.filter((elem) => !mutedIds.includes(elem.id)));
      } else setUsers(channel.users);
    }
  }, [channel]);

  return (
    <Fragment>
      {channel ? (
        <div
          className="conversation__options__members"
          key={props.currentConvId}
        >
          <MemberCategory
            type={"Admins"}
            isOwner={status === "owner"}
            isAdmin={status === "admin"}
            channelId={channel.id}
            users={admins}
          />
          <MemberCategory
            type={"Members"}
            isOwner={status === "owner"}
            isAdmin={status === "admin"}
            channelId={channel.id}
            users={users as User[] | null}
          />
          <MemberCategory
            type={"Muted"}
            isOwner={status === "owner"}
            isAdmin={status === "admin"}
            channelId={channel.id}
            users={mutedMembers as User[] | null}
          />
          <MemberCategory
            type={"Banned"}
            isOwner={status === "owner"}
            isAdmin={status === "admin"}
            channelId={channel.id}
            users={banned as User[] | null}
          />
        </div>
      ) : null}
    </Fragment>
  );
}

function ChannelProfile(props: { channel: IChannel; owner: User | null }) {
  const { currentConv } = useContext(ChatDisplayContext);
  const { channel, owner } = props;
  const { user } = useContext(AuthContext);
  const [ searchBar, setSearchBar ] = useState<boolean>(false);

  const leaveChannel = async () => {
    await api
      .post("/channel/leave", { id: channel.id })
      .catch((error: any) => toast.error("HTTP error:" + error));
  };

  const deleteChannel = async () => {
    await api
      .post("/channel/delete", { id: channel.id })
      .catch((error: any) => toast.error("HTTP error:" + error));
  };

  useEffect( () => {
    if (!currentConv) return;
    setSearchBar(false);
  }, [currentConv])

  return (
    <div className="conversation__options__title">
      <div className="text">
        <span>{channel.name}</span>
        {/* <div className="date">
          conv started at: {channel.createdAt.toLocaleString()}
        </div> */}
        {/* <span className="owner">owned by: {owner?.username}</span> */}
        <button className="clickable_profile">
          <Link
            style={{ textDecoration: "none" }}
            to={"/profile/" + owner?.username}
          >
            <img src={owner?.profile_picture} />
          </Link>
        </button>
        <div className="actions__channel">
          <button className="action" onClick={leaveChannel}>
            <LeaveIcon />
            <span>leave</span>
          </button>
          {owner?.id === user?.id && (
            <button className="action" onClick={deleteChannel}>
              <DeleteIcon />
              <span>delete</span>
            </button>
          )}
          {owner?.id === user?.id && channel.status === "Private" && (
            <button
              className="action"
              onClick={() => setSearchBar(!searchBar)}
            >
              <PlusIcon />
              <span>invite</span>
            </button>
          )}
          {
            searchBar && (
              <SearchBarPlayerInvitation channel={channel}/>
            )
          }
          <ChannelPassword owner={owner} channel={channel} />
        </div>
        <div></div>
      </div>
    </div>
  );
}

function ChannelOptions(props: {
  currentConvId: string;
  receivedChannel: IDatas | null;
}) {
  const [owner, setOwner] = useState<User | null>(null);

    useEffect(() => {
        if (props.receivedChannel && props.receivedChannel.data)
            setOwner(props.receivedChannel.data.owner);
    }, [props.receivedChannel])

  if (!props.receivedChannel || !props.receivedChannel.data)
    return <Fragment />;
  else
    return (
      <Fragment>
        <ChannelProfile channel={props.receivedChannel.data} owner={owner} />
        <ChannelMembers
          receivedChannel={props.receivedChannel}
          currentConvId={props.currentConvId}
          owner={owner}
          setOwner={setOwner}
        />
      </Fragment>
    );
}

export default ChannelOptions;
