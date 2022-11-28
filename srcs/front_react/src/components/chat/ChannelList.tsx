import { useContext, useEffect, useRef, useState } from "react";
import { IChannel, IDm, IMessageReceived } from "./types";
import { api } from "../../const/const";
import "./chat.style.scss";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import {
  ChatDisplayContext,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { ReactComponent as GroupChatIcon } from "../../assets/img/icon/user.svg";
import { NotifContext } from "../../contexts/ChatNotificationContext";
import { ReactComponent as CirclePlusIcon } from "../../assets/img/icon/circle_plus.svg";

function ChannelList() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { newMessage, chatList, setChatList } = useContext(MessageContext);
  const { addChannel, changeNotif, isNotif } = useContext(NotifContext);
  const {
    currentConv,
    isChannel,
    setDisplay,
    setCurrentConv,
    setIsChannel,
    newConv,
    setRedirection,
    setMuted,
    setMuteDate,
  } = useContext(ChatDisplayContext);
  const messagesTopRef = useRef<null | HTMLDivElement>(null);


  const scrollToTop = () => {
    setTimeout(() => {
      messagesTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const loadList = async () => {
    await api
      .get("/user/conversations")
      .then((res) => {
        const copy_data: IChannel[] = res.data;
        copy_data.forEach((channel: IChannel) => {
          addChannel(channel.id, false);
        });
        setChatList(copy_data);
      })
      .catch(() => console.log("Axios Error"));
  };

  const actualizeChannelList = (
    newList: (IChannel | IDm)[],
    editable_room: IChannel | IDm
  ) => {
    if (newMessage) editable_room.updatedAt = newMessage.createdAt;
    if (currentConv && editable_room.id != currentConv)
      changeNotif(editable_room.id, true);
    newList.sort((a, b) => {
      if (a.updatedAt < b.updatedAt) return 1;
      else return -1;
    });
    return newList;
  };

  const addToChannelList = (newList: (IChannel | IDm)[]) => {
    let new_elem;

    if (newMessage?.dm) new_elem = newMessage.dm;
    if (newMessage?.channel) new_elem = newMessage?.channel;
    if (newMessage?.author?.id === user?.id) addChannel(new_elem.id, false);
    else addChannel(new_elem.id, true);
    newList = [new_elem, ...newList];
    return newList;
  };

  const updateList = () => {
    if (!newMessage) return;
    else
      var received_id = newMessage.channel // TODO change var to let
        ? newMessage.channel.id
        : newMessage.dm.id;

    let newList = [...chatList];
    let editable_room = newList.find((elem) => elem.id === received_id);

    if (editable_room) newList = actualizeChannelList(newList, editable_room);
    else newList = addToChannelList(newList);
    setChatList(newList);
  };

  const clickItem = (conv: IChannel) => {
    setMuted(false);
    setMuteDate(null);
    setDisplay(ChatType.CONV);
    setCurrentConv(conv.id);
    setRedirection(false);
    if (conv.name) setIsChannel(true);
    else setIsChannel(false);
    changeNotif(conv.id, false);
  };

  const displayNotif = (convId: string) => {
    if (isNotif(convId)) return <div className="notif" />;
    return null;
  };

  const MessageListItems = chatList?.map((conv: any) => {
    let title: string | undefined;
    let user2: User | null = null;

    if (!conv) return;
    if (conv.name) title = conv.name;
    else {
      if (!conv.users) return;
      user2 =
        conv.users[0].username !== user?.username
          ? conv.users[0]
          : conv.users[1];
      title = user2?.username;
    }
    return (
      <div className="chat__list__items" key={conv.id}>
        <button>
          <li title={title} onClick={() => clickItem(conv)}>
            <div className="avatar">
              {user2 ? (
                <img src={user2.profile_picture + "&size=small"} />
              ) : (
                <GroupChatIcon />
              )}
            </div>
            <div className="text__notif">
              <span>{title}</span>
              {displayNotif(conv.id)}
            </div>
          </li>
        </button>
      </div>
    );
  });

  const addNewElemToList = () => {
    if (chatList.find((elem) => elem.id === currentConv) || !isChannel) return;
    else {
      let newList = [newConv, ...chatList];
      setChatList(newList);
    }
  };

  useEffect(() => {
    const async_fct = async () => await loadList();

    async_fct();
  }, []);

  useEffect(() => {
    if (!newConv) return;
    addNewElemToList();
  }, [newConv]);

  useEffect(() => {
    if (!newMessage) return;
    updateList();
    scrollToTop();
  }, [newMessage]);

  return (
    <div className="chat__list">
      <div className="chat__list__header">
        Channels
        <button onClick={() => setDisplay(ChatType.JOINFORM)}>
          <CirclePlusIcon />
        </button>
      </div>
      <ul className="chat__list__body">
        <div ref={messagesTopRef} />
        {MessageListItems}
      </ul>
    </div>
  );
}

export default ChannelList;
