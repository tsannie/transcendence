import { useContext, useEffect, useState } from "react";
import { IChannel } from "./types";
import { api } from "../../const/const";
import "./chat.style.scss"
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import { ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";
import  {ReactComponent as GroupChatIcon} from "../../assets/img/icon/groupchat.svg";
import { NotifContext } from "../../contexts/NotificationsContext";
  
function MessageList() {
    const { user } = useContext(AuthContext) as AuthContextType;
    const { newMessage } = useContext(MessageContext);
    const { addChannel, changeNotif, isNotif } = useContext(NotifContext);
    const { currentConvId, changeDisplay, changeCurrentConv, changeIsChannel } = useContext(ChatStateContext);

    const [chatList, setChatList] = useState<IChannel[]>([]);
  
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
  
    const updateList = () => {
      let newList = [...chatList];
      let received_id = newMessage?.channel ? newMessage?.channel.id : newMessage?.dm.id;

      let editable_room = newList.find( (elem) => elem.id === received_id);
      if (editable_room && newMessage)
      {
        editable_room.updatedAt = newMessage.createdAt;
        changeNotif(editable_room.id, true);
        newList.sort( (a,b) => {
          if (a.updatedAt < b.updatedAt)
            return 1;
          else
            return -1;
        })
      }
      else
      {
        if (!newList || !newMessage)
          return ;
        let new_elem;

        if (newMessage?.dm)
          new_elem = newMessage.dm;
        if (newMessage?.channel)
          new_elem = newMessage?.channel;
        addChannel(new_elem.id, true);
        newList = [new_elem, ...newList]
      }
      setChatList(newList);
    }

    const disableNotif = (conv: IChannel) => {
      changeNotif(conv.id, false);
    }

    const clickItem = (conv: IChannel) => {
      changeDisplay(ChatType.CONV);
      changeCurrentConv(conv.id);
      if (conv.name)
        changeIsChannel(true);
      else
        changeIsChannel(false);
      disableNotif(conv);
    }

    const displayNotif = (convId: string) => {
      console.log("convID: =", convId);
      console.log("IsNotif = ", isNotif(convId));
      if (isNotif(convId) && currentConvId == convId)
        changeNotif(convId, false);
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
            <li className="chat__list__items" key={conv.id} onClick={ () => clickItem(conv)}>
              {user2 ? <img src={user2.profile_picture + "&size=small"} className="avatar"/> : <GroupChatIcon className="avatar" />}
              {title}
              {displayNotif(conv.id)}
            </li>
            )
      });
  
      //EQUIVALENT TO COMPONENTDIDMOUNT
      useEffect( () => {
        const async_fct = async () => await loadList(); 
        
        async_fct();
      }, []);
  
      useEffect( () => {
        updateList();
      }, [newMessage])
  
    return (
    <div className="chat__list">
      <div className="chat__list__header">Channels</div>
      <ul className="chat__list__body">{MessageListItems}</ul>
    </div>)
  }

  export default MessageList;