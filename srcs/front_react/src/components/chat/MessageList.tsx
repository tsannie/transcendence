import { useContext, useEffect, useRef, useState } from "react";
import { IChannel, IMessageReceived } from "./types";
import { api } from "../../const/const";
import "./chat.style.scss"
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import { ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";
import  {ReactComponent as GroupChatIcon} from "../../assets/img/icon/user.svg";
import { NotifContext } from "../../contexts/ChatNotificationContext";
  
function MessageList() {
    const { user } = useContext(AuthContext) as AuthContextType;
    const { newMessage } = useContext(MessageContext);
    const { channels, addChannel, changeNotif, isNotif } = useContext(NotifContext);
    const { currentConvId, changeDisplay, changeCurrentConv, changeIsChannel } = useContext(ChatStateContext);
    const messagesTopRef = useRef<null | HTMLDivElement>(null);

    const [chatList, setChatList] = useState<IChannel[]>([]);
  
    const scrollToTop = () => {
      setTimeout( () => {
        messagesTopRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }

    const loadList = async () => {
      await api
      .get("/user/conversations")
      .then((res) => {
        const copy_data: IChannel[] = res.data;
        copy_data.forEach((channel: IChannel) => {
          addChannel(channel.id, false);
        })
        setChatList(copy_data);
      })
      .catch( () => console.log("Axios Error"));
    }
    
    const actualizeChannelList = (newList : IChannel[], editable_room : IChannel) => {
      if (newMessage)
        editable_room.updatedAt = newMessage.createdAt;
      if (currentConvId && editable_room.id != currentConvId)
        changeNotif(editable_room.id, true);
      newList.sort( (a,b) => {
        if (a.updatedAt < b.updatedAt)
          return 1;
        else
          return -1;
      })
      return newList;
    }

    const addToChannelList = (newList : IChannel[]) => {
      let new_elem;

      if (newMessage?.dm)
        new_elem = newMessage.dm;
      if (newMessage?.channel)
        new_elem = newMessage?.channel;
      addChannel(new_elem.id, true);
      newList = [new_elem, ...newList]
      return newList;
    }
  
    const updateList = () => {
      if (!newMessage)
        return;
      else
        var received_id = newMessage.channel ? newMessage.channel.id : newMessage.dm.id;

      let newList = [...chatList];
      let editable_room = newList.find( (elem) => elem.id === received_id);
      
      if (editable_room)
        newList = actualizeChannelList(newList, editable_room);
      else
        newList = addToChannelList(newList);
      setChatList(newList);
    }

    const clickItem = (conv: IChannel) => {
      changeDisplay(ChatType.CONV);
      changeCurrentConv(conv.id);
      if (conv.name)
        changeIsChannel(true);
      else
        changeIsChannel(false);
      changeNotif(conv.id, false);
     }

    const displayNotif = (convId: string) => {
      if (isNotif(convId))
        return <div className="notif" />;
      return null;
    }
  
    const MessageListItems = chatList.map( (conv: any) => {
        let title : string | undefined;
        let user2: User | null = null;


        if (conv.name)
          title = conv.name;
        else
        {
          user2 = conv.users[0].username !== user?.username ? conv.users[0] : conv.users[1];
          title = user2?.username;
        }
        return (
          <div className="chat__list__items" key={conv.id}>
            <li onClick={ () => clickItem(conv)}>
              <div className="avatar">
                {user2 ? <img src={user2.profile_picture + "&size=small"} /> : <GroupChatIcon />}
              </div>
              <div className="text__notif">
                <span>{title}</span>
                {displayNotif(conv.id)}
              </ div>
            </li>
          </ div>
            )
      });
  
      useEffect( () => {
        const async_fct = async () => await loadList(); 
        
        async_fct();
      }, []);
  
      useEffect( () => {
        console.log("ICI", channels);
        updateList();
        scrollToTop();
      }, [newMessage]);

    return (
    <div className="chat__list">
      <div className="chat__list__header">Channels</div>
      <ul className="chat__list__body">
        <div ref={messagesTopRef} />
        {MessageListItems}
      </ul>
    </div>)
  }

  export default MessageList;