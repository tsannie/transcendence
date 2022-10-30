import { Box, Grid, Popover, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { IChannel, IMessageReceived } from "./types";
import { api, COOKIE_NAME } from "../../const/const";
import { ChatList, ChatListProvider } from "../../contexts/ChatContext";
import "./chat.style.scss"
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";

function MessageList() {
  const { user } = useContext(AuthContext) as AuthContextType;
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

    useEffect( () => {
      loadList();
      }, []);

  return (<ul className="chat__list__body">{MessageListItems}</ul>)
}

function Chat() {
  return (
      <div className="chat">
        <div className="chat__list">
          <div className="chat__list__header">Channels</div>
          <MessageList />
        </div>
      </div>
  );
}

export default Chat;
