import { useContext, useEffect, useRef, useState } from "react";
import { IChannel } from "./types";
import { api } from "../../const/const";
import "./chat.style.scss"
import { AuthContext, AuthContextType, AuthProvider, User } from "../../contexts/AuthContext";
import { io } from "socket.io-client";
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
      console.log("DATAAAAAS = ", res.data)
      setChatList(res.data);
    })
    .catch( () => console.log("Error"));
  }

  const MessageListItems = chatList.map( (conv: any) => {
      if (conv.name)
          return <li className="chat__list__items" key={conv.id}>{conv.name}</li>
      else
          return (<li className="chat__list__items" key={conv.id}>{conv.users[0].username !== user?.username ? conv.users[0].username : conv.users[1].username}</li>)
    });

    //EQUIVALENT TO COMPONENTDIDMOUNT
    useEffect( () => {
      console.log("USER = ", user);
      console.log("message = ", message);
      loadList();
    }, []);

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
