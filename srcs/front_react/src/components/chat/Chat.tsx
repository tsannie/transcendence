import { useContext } from "react";
import {
  ChatDisplayContext,
  ChatType
} from "../../contexts/ChatDisplayContext";
import ChannelList from "./ChannelList";
import "./chat.style.scss";
import Conversation from "./Conversation";
import CreateChannelForm from "./CreateChannelForm";
import JoinChannelForm from "./JoinChannelForm";

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
