import MessageList from "./MessageList"
import "./chat.style.scss"
import { MessageProvider } from "../../contexts/MessageContext";
import { ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";
import { useContext } from "react";

function ChatBody() {
  const {display, currentConvId} = useContext(ChatStateContext);
  if (display === ChatType.CONV)
    return (<div>
        <h3>{currentConvId}</h3></div>)
  else
      return (<div></div>)
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
