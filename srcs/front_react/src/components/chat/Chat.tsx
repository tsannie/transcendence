import MessageList from "./MessageList"
import "./chat.style.scss"
import { MessageContext, MessageProvider } from "../../contexts/MessageContext";
import { ChatContextInterface, ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { IDm, IMessageReceived } from "./types";
import { api } from "../../const/const";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import  {ReactComponent as SendIcon} from "../../assets/img/icon/send.svg";

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
  const { user } = useContext(AuthContext) as AuthContextType;

  const { newMessage } = useContext(MessageContext);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const scrollToBottom = (smooth: boolean = false) => {
      setTimeout(() => {
        if (!smooth)
          messagesEndRef.current?.scrollIntoView(false);
        else
          messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
      }
        , 200);
    }

  const loadDm = async () => {
    await api
      .get("/dm/getById", {params: {id: props.id}})
      .then((res) => {
        setDm(res.data);
      })
      .catch( () => console.log("Axios Error"));
  }

  const loadMessage = async () => {
    await api
      .get("/message/dm", {params: {id: props.id, offset: offset}})
      .then((res) => {
        console.log(res.data);
        setMessages(res.data);
        setOffset(0);
      })
      .catch( () => console.log("Axios Error"));
  }

  const addMessage = (newMessage: IMessageReceived | null) => {
    if (newMessage)
      setMessages([...messages, newMessage]);
  }

  const displayMessages = messages.map( (message) => { 
      let items_class : string;

      if (message.author?.id === user?.id)
        items_class = "conversation__messages__items self";
      else
        items_class = "conversation__messages__items other";
      return <li className={items_class} key={message.id}>
                <img src={message.author?.profile_picture + "&size=small"} className="avatar" />
                <div className="conversation__messages__text">{message.content}</div>
              </ li>
    });

  useEffect( () => {
    const async_func = async () => {
      await loadDm();
      await loadMessage();
    };
    
    async_func();
    scrollToBottom();
  }, [props.id]);

  useEffect ( () => {
    if (newMessage && newMessage?.dm.id == dm.id)
    { 
      addMessage(newMessage);
      scrollToBottom(true);
    }
  }, [newMessage]);

  return (
      <Fragment>
        <div className="conversation__elems">
          <ul className="conversation__messages__list">{displayMessages}
            <div ref={messagesEndRef}/>
          </ul>
          <MessageForm />
        </div>
          <div className="conversation__options">
            <div className="conversation__options__title" />
          </div>
      </ Fragment>
      );
}

function MessageForm() {
  return (
    <form>
        <input className="input__form" type="text" placeholder="add message..."/>
          <SendIcon className="send__button" onClick={() => console.log("cc")}/>
    </ form>
  )
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
