import "./chat.style.scss";
import {
  ChatDisplayContext,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { useContext } from "react";
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
  return (
    <div className="chat">
      <ChannelList />
      <ChatBody />
    </div>
  );
}

export default Chat;
