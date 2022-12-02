import "./chat.style.scss";
import { MessageContext } from "../../contexts/MessageContext";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { IChannel, IDm, IMessageReceived } from "./types";
import { api } from "../../const/const";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import SendMessageForm from "./SendMessageForm";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { toast } from "react-toastify";
import { IDatas } from "./Conversation";

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

function MessageBody(props: {
  currentConvId: string;
  isChannel: boolean;
  data: IDm | IDatas | null;
}) {
  const { currentConvId, isChannel, data } = props;
  const { user } = useContext(AuthContext) as AuthContextType;
  const { newMessage } = useContext(MessageContext);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const [messages, setMessages] = useState<IMessageReceived[]>([]);

  const scrollToBottom = (smooth: boolean = false) => {
    setTimeout(() => {
      if (!smooth) messagesEndRef.current?.scrollIntoView(false);
      else messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const loadMessage = async () => {
    let route: string;

    if (isChannel) route = "/message/channel";
    else route = "/message/dm";

    api
      .get(route, { params: { id: currentConvId } })
      .then((res) => {
        const unorderedMessages: IMessageReceived[] = res.data;
        setMessages(
          unorderedMessages.sort((a, b) => {
            if (a.createdAt < b.createdAt) return -1;
            else return 1;
          })
        );
      })
      .catch((err) => toast.error("HTTP error: " + err.response.data.message));
  };

  const addMessage = (newMessage: IMessageReceived | null) => {
    if (newMessage && !messages.map((elem) => elem.id).includes(newMessage.id))
      setMessages([...messages, newMessage]);
  };

  useEffect(() => {
    if (!currentConvId) return;

    loadMessage();
    scrollToBottom();
  }, [currentConvId]);

  useEffect(() => {
    if (!newMessage) return;
    if (
      newMessage?.dm?.id == currentConvId ||
      newMessage?.channel?.id == currentConvId
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
        <SendMessageForm
          convId={currentConvId}
          isChannel={isChannel}
          data={data}
        />
      </div>
    </Fragment>
  );
}

export default MessageBody;
