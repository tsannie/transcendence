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
    const message = useContext(MessageContext);
    const { display, changeDisplay, currentConvId, changeCurrentConv } = useContext(ChatStateContext);

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
      let conv_id = message?.channel ? message?.channel.id : message?.dm.id;
      let editable_room = newList.find( (elem) => elem.id === conv_id);
      if (editable_room && message)
      {
        editable_room.notif = true;
        editable_room.updatedAt = message.createdAt;
      }
      newList.sort( (a,b) => {
        if (a.updatedAt < b.updatedAt)
          return 1;
        else
          return -1;
      })
      setChatList(newList);
    }

    //TODO SEARCH ITEM BY ID AND EDIT the NOTIF field if it exists
    const clickItem = (data: string) => {
      console.log(data)
      changeDisplay(ChatType.CONV);
      changeCurrentConv(data);
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
          console.log(user2?.profile_picture + "&size=small")
        }
        return (
            <li className="chat__list__items" key={conv.id} onClick={ () => clickItem(conv.id)}>
              {user2 ? <img src={user2.profile_picture + "&size=small"} className="avatar"></img> : <GroupChatIcon className="avatar" />}
              {title}
              {conv.notif ? <div className="notif" /> : null}
            </li>
            )
      });
  
      //EQUIVALENT TO COMPONENTDIDMOUNT
      useEffect( () => {
        loadList();
      }, []);
  
      useEffect( () => {
        updateList();
      }, [message])
  
    return (
    <div className="chat__list">
      <div className="chat__list__header">Channels</div>
      <ul className="chat__list__body">{MessageListItems}</ul>
    </div>)
  }

  export default MessageList;