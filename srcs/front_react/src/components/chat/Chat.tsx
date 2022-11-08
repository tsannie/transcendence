import MessageList from "./MessageList"
import "./chat.style.scss"
import { MessageProvider } from "../../contexts/MessageContext";
import { ChatDisplayContext, ChatStateProvider, ChatType } from "../../contexts/ChatDisplayContext";
import { useContext } from "react";
import Conversation from "./Conversation";
import NotifProvider from "../../contexts/ChatNotificationContext";
import CreateChannelForm from "./CreateChannelForm";

function ChatBody() {
  const {display} = useContext(ChatDisplayContext);

  if (display === ChatType.CONV)
    return <Conversation />;
  else if (display === ChatType.FORM)
    return <CreateChannelForm />
  else
    return <div></div>;
}

function Chat() {
  return (
      <div className="chat">
        <MessageProvider>
        <ChatStateProvider>
        <NotifProvider>
          <MessageList />
          <ChatBody />
        </NotifProvider>
        </ChatStateProvider>
        </MessageProvider>
      </div>
  );
}

export default Chat;
