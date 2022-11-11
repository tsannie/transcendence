import "./chat.style.scss";
import { MessageContext } from "../../contexts/MessageContext";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { IMessageReceived } from "./types";
import { api } from "../../const/const";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import SendMessageForm from "./SendMessageForm";

function MessageList(props: any) {
  const user: User = props.user;
  const messages: IMessageReceived[] = props.messages;

  return (
    <Fragment>
      {messages.map((message: IMessageReceived) => {
        let items_class: string;

        if (message.author?.id === user?.id)
          items_class = "conversation__messages__items self";
        else items_class = "conversation__messages__items other";
        return (
          <li className={items_class} key={message.id}>
            <img
              src={message.author?.profile_picture + "&size=small"}
              className="avatar"
            />
            <div className="conversation__messages__text">
              {message.content}
            </div>
          </li>
        );
      })}
    </Fragment>
  );
}

function MessageBody(props: {currentConvId: string, isChannel: boolean}) {
  const {currentConvId, isChannel} = props;
  const { user } = useContext(AuthContext) as AuthContextType;
  const { newMessage } = useContext(MessageContext);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const [offset, setOffset] = useState<number>(0);
  const [messages, setMessages] = useState<IMessageReceived[]>([]);

  const scrollToBottom = (smooth: boolean = false) => {
    setTimeout(() => {
      if (!smooth) messagesEndRef.current?.scrollIntoView(false);
      else messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const loadMessage = async () => {
    let route: string;

    if (!currentConvId)
      return ;
    if (isChannel) route = "/message/channel";
    else route = "/message/dm";

    await api
      .get(route, { params: { id: currentConvId, offset: offset } })
      .then((res) => {
        const unorderedMessages: IMessageReceived[] = res.data;
        setMessages(
          unorderedMessages.sort((a, b) => {
            if (a.createdAt < b.createdAt) return -1;
            else return 1;
          })
        );
        setOffset(0);
      })
      .catch(() => console.log("Axios Error while loading messages"));
  };

  const addMessage = (newMessage: IMessageReceived | null) => {
    if (newMessage) setMessages([...messages, newMessage]);
  };

  useEffect(() => {
    const async_func = async () => {
      await loadMessage();
    };

    async_func();
    scrollToBottom();
  }, [currentConvId]);

  useEffect(() => {
    if (
      newMessage &&
      (newMessage?.dm?.id == currentConvId ||
        newMessage?.channel?.id == currentConvId)
    ) {
      addMessage(newMessage);
      scrollToBottom(true);
    }
  }, [newMessage]);

  return (
    <Fragment>
      <div className="conversation__elems">
        <ul className="conversation__messages__list">
          <MessageList messages={messages} user={user} />
          <div ref={messagesEndRef} />
        </ul>
        <SendMessageForm convId={currentConvId} isChannel={isChannel} />
      </div>
    </Fragment>
  );
}

export default MessageBody;
