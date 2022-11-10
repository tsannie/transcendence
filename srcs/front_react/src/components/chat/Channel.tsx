import "./chat.style.scss";
import { MessageContext } from "../../contexts/MessageContext";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { IChannel, IDm, IMessageReceived, IMessageSent } from "./types";
import { api } from "../../const/const";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { ReactComponent as SendIcon } from "../../assets/img/icon/send.svg";
import { toast } from "react-toastify";

function MessageForm(props: any) {
  const convId = props.convId;
  const isChannel = props.isChannel;

  const { socket } = useContext(MessageContext);
  const { isRedirection, setRedirection, targetRedirection, setNewConv, setCurrentConv } = useContext(ChatDisplayContext);
  const [input, setInput] = useState<string>("");

  const actualize_input = (event: any) => {
    setInput(event.target.value);
  };

  const createConv = async () => {
    let createdId : string | null = null;

    await api
      .post("/dm/create", {targetId: targetRedirection.toString()})
      .then((res) => {
        setRedirection(false);
        setNewConv(res.data);
        setCurrentConv(res.data.id);
        createdId = res.data.id;
      })
      .catch((err) => {
        toast.error("HTTP error: " + err);
      })
      return createdId;
  }

  const sendMessage = async (event: any) => {
    let inputConvId : string | null = convId;
  
    event.preventDefault();
    if (input === "") return;
    if (isRedirection && targetRedirection)
      inputConvId = await createConv();
    if (!inputConvId)
      return ;

    const data: IMessageSent = {
      convId: inputConvId,
      content: input,
      isDm: !isChannel,
    };
    socket?.emit("message", data);
    setInput("");
  };

  return (
    <form onSubmit={sendMessage}>
      <input
        className="input__form"
        type="text"
        placeholder="add message..."
        value={input}
        onChange={actualize_input}
      />
      <SendIcon className="send__button" onClick={sendMessage} />
    </form>
  );
}

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
        <MessageForm convId={currentConvId} isChannel={isChannel} />
      </div>
    </Fragment>
  );
}

export default MessageBody;
