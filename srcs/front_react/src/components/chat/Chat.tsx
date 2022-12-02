import "./chat.style.scss";
import { MessageContext, MessageProvider } from "../../contexts/MessageContext";
import {
  ChatDisplayContext,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { useContext, useEffect } from "react";
import Conversation from "./Conversation";
import CreateChannelForm from "./CreateChannelForm";
import JoinChannelForm from "./JoinChannelForm";
import ChannelList from "./ChannelList";

function ChatBody() {
  const { display } = useContext(ChatDisplayContext);

  switch (display) {
    case ChatType.CONV:
      return <Conversation />;
    case ChatType.CREATEFORM:
      return <CreateChannelForm />;
    case ChatType.JOINFORM:
      return <JoinChannelForm />;
    default:
      return <></>;
  }
}

function Chat() {
  const { setChannelNotification } = useContext(MessageContext);

  useEffect( () => {
    setChannelNotification(false);
  }, [])

  return (
    <div className="chat">
      <ChannelList />
      <ChatBody />
    </div>
  );
}

export default Chat;
