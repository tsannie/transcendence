import MessageList from "./MessageList"
import "./chat.style.scss"
import { MessageProvider } from "../../contexts/MessageContext";
import { ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";
import { useContext } from "react";
import Conversation from "./Conversation";

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
{/*      TODO
        <div className="chat_bg" /> */}
        <MessageProvider>
        <ChatStateProvider>
          <MessageList />
          <ChatBody />
        </ChatStateProvider>
        </MessageProvider>
      </div>
  );
}

export default Chat;
