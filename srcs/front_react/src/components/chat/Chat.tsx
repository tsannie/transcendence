import MessageList from "./MessageList"
import "./chat.style.scss"
import { MessageProvider } from "../../contexts/MessageContext";
import { ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";
import { useContext } from "react";

function Conversation() {
  const { currentConvId, isChannel } = useContext(ChatStateContext);

  return (<div>
      <h3>Hello World : {currentConvId} IsChannel ? {isChannel ? "True": "false"}</h3>
    </ div>)
}

function ChatBody() {
  const {display} = useContext(ChatStateContext);
  if (display === ChatType.CONV)
    return <Conversation />
  else if (display === ChatType.FORM)
    return (<div></div>)
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
