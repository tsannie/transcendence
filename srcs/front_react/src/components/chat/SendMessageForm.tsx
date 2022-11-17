import "./chat.style.scss";
import { MessageContext } from "../../contexts/MessageContext";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { useContext, useState } from "react";
import { IMessageSent } from "./types";
import { api } from "../../const/const";
import { ReactComponent as SendIcon } from "../../assets/img/icon/send.svg";
import { toast } from "react-toastify";

function SendMessageForm(props: any) {
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

  export default SendMessageForm;