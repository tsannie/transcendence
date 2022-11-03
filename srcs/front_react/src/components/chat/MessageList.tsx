import { useContext, useEffect, useState } from "react";
import { IChannel } from "./types";
import { api } from "../../const/const";
import "./chat.style.scss"
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import { ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";
import  {ReactComponent as GroupChatIcon} from "../../assets/img/icon/groupchat.svg";
  
function MessageList() {
    const { user } = useContext(AuthContext) as AuthContextType;
    const { newMessage } = useContext(MessageContext);
    const { changeDisplay, changeCurrentConv, changeIsChannel } = useContext(ChatStateContext);

    const [chatList, setChatList] = useState<IChannel[]>([]);
  
    const loadList = async () => {
      await api
      .get("/user/conversations")
      .then((res) => {
        res.data.forEach((channel: IChannel) => {
          channel.notif = false;
        });
        setChatList(res.data);
      })
      .catch( () => console.log("Axios Error"));
    }
  
    const updateList = () => {
      let newList = [...chatList];
      let conv_id = newMessage?.channel ? newMessage?.channel.id : newMessage?.dm.id;
      let editable_room = newList.find( (elem) => elem.id === conv_id);
      if (editable_room && newMessage)
      {
        editable_room.notif = true;
        editable_room.updatedAt = newMessage.createdAt;
      }
      newList.sort( (a,b) => {
        if (a.updatedAt < b.updatedAt)
          return 1;
        else
          return -1;
      })
      setChatList(newList);
    }

    const disableNotif = (conv: IChannel) => {
      let newList = [...chatList];
      let editable_room = newList.find( (elem) => elem.id === conv.id);
      if (editable_room)
        editable_room.notif = false;
      setChatList(newList);
    }

    const clickItem = (conv: IChannel) => {
      changeDisplay(ChatType.CONV);
      changeCurrentConv(conv.id);
      if (conv.name)
        changeIsChannel(true);
      else
        changeIsChannel(false);
      if (conv.notif)
        disableNotif(conv);
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
              {conv.notif ? <div className="notif" /> : null}
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