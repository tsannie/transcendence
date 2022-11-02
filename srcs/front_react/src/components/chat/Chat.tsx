import MessageList from "./MessageList"
import "./chat.style.scss"
import { MessageContext, MessageProvider } from "../../contexts/MessageContext";
import { ChatContextInterface, ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";
import { Fragment, useContext, useEffect, useState } from "react";
import { IDm, IMessageReceived } from "./types";
import { api } from "../../const/const";

function Channel(props: any) {
  return (
      <Fragment>
        <div className="conversation__content" />
          <div className="conversation__options">
            <div className="conversation__options__title" />
          </div>
      </Fragment>
      );
}

function Dm(props: any) {
  const [dm, setDm] = useState<IDm>({} as IDm);
  const [offset, setOffset] = useState<number>(0);
  const [messages, setMessages] = useState<IMessageReceived[]>([]);

  const { newMessage, changeNewMessage } = useContext(MessageContext);

  const loadMessage = async () => {
    await api
      .get("/message/dm", {params: {id: props.id, offset: offset}})
      .then((res) => {
        console.log(res.data);
        setMessages(res.data);
        setOffset(offset + 1);
      })
      .catch( () => console.log("Axios Error"));
  }

  const addMessage = (newMessage: IMessageReceived | null) => {
    if (newMessage)
      setMessages([...messages, newMessage]);
  }

  const displayMessages = messages.map( (message) => {
      return <li key={message.id}>{message.content}</ li>
    });

  useEffect( () => {
    loadMessage();
  }, []);

  useEffect ( () => {
    addMessage(newMessage);
    changeNewMessage(null);
  }, [newMessage]);

  return (
      <Fragment>
        <div className="conversation__content">
          <ul>{displayMessages}</ul>
        </div>
          <div className="conversation__options">
            <div className="conversation__options__title" />
          </div>
      </Fragment>
      );
}

function Conversation() {
  const { currentConvId, isChannel } = useContext(ChatStateContext);

  return <div className="conversation">
    { isChannel ? <Channel id={currentConvId} /> : <Dm id={currentConvId} /> }
    </ div>;
}

function ChatBody() {
  const {display} = useContext(ChatStateContext);

  if (display === ChatType.CONV)
    return <Conversation />;
  else
    return <div></div>;
}

function Chat() {
  return (
      <div className="chat">
        <MessageProvider>
        <ChatStateProvider>
          {/* This loads the left part of the chat page with the list of convs */}
          <MessageList />

          {/* This loads the right part of the chat */}
          <ChatBody />

        </ChatStateProvider>
        </MessageProvider>
      </div>
  );
}

export default Chat;
