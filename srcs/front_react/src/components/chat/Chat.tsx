import { useContext, useEffect, useRef, useState } from "react";
import { IChannel } from "./types";
import { api } from "../../const/const";
import "./chat.style.scss"
import { AuthContext, AuthContextType, AuthProvider, User } from "../../contexts/AuthContext";
import { SocketContext, SocketProvider } from "../../contexts/SocketContext";

interface IProps {
  user: User | null;
}

function MessageList() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const message = useContext(SocketContext);

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
        return <li className="chat__list__items" key={conv.id}>{conv_title}</li>
    });

    //EQUIVALENT TO COMPONENTDIDMOUNT
    useEffect( () => {
      loadList();
    }, []);

    useEffect( () => {
      updateList();
    }, [message])

  return (<ul className="chat__list__body">{MessageListItems}</ul>)
}

function Chat() {
  return (
      <div className="chat">
        <div className="chat__list">
          <div className="chat__list__header">Channels</div>
            <SocketProvider>
              <MessageList />
            </SocketProvider>
        </div>
      </div>
  );
}

export default Chat;
