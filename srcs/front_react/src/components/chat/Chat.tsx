import MessageList from "./MessageList"
import "./chat.style.scss"
import { MessageProvider } from "../../contexts/MessageContext";
import { ChatStateContext, ChatStateProvider, ChatType } from "../../contexts/ChatContext";
import { useContext } from "react";

function Channel(props: any) {
  return (
      <div>
        <h3>ChannelId : {props.id}</h3>
      </div>
      );
}

function Dm(props: any) {
  return (
    <div>
        <div className="conversation__target" />
        <div className="conversation__content"></ div>
      </div>
      );
}

function Conversation() {
  const { currentConvId, isChannel } = useContext(ChatStateContext);

  if (isChannel)
    return <Channel id={currentConvId}/>  
  else
    return <Dm id={currentConvId}/>
}

function ChatBody() {
  const {display} = useContext(ChatStateContext);

  // if (display === ChatType.CONV)
    return (<div className="conversation"><Conversation /></div>)
  // else if (display === ChatType.FORM)
    return (<div></div>)
  // else
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
