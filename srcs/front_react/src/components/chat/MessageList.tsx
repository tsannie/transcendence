import { useContext, useEffect, useState } from "react";
import { IChannel } from "./types";
import { api } from "../../const/const";
import "./chat.style.scss"
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import { ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";

  
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
      /* Imbricated ternary operators. First one is to distinguate DM from Channel, and second one is to get the name of other user, than us */
        const conv_title = conv.name ? conv.name : (conv.users[0].username !== user?.username ? conv.users[0].username : conv.users[1].username);
        
        if (conv.notif)
            return (
            <li className="chat__list__items" key={conv.id}>
              <div className="notif" />
                {conv_title}
            </li>
            )
        else
          return <li className="chat__list__items" key={conv.id} onClick={ () => clickItem(conv.id)}>{conv_title}</li>
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