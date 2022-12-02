import "./chat.style.scss";
import { MessageContext } from "../../contexts/MessageContext";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { useContext, useState } from "react";
import { IChannel, IDm, IMessageSent } from "./types";
import { api } from "../../const/const";
import { ReactComponent as SendIcon } from "../../assets/img/icon/send.svg";
import { toast } from "react-toastify";
import { IDatas } from "./Conversation";
import { useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";

function SendMessageForm(props: {convId: string, isChannel: boolean, data: IDm | IDatas | null}) {
    const { convId, isChannel, data } = props;

    const { user } = useContext(AuthContext);
    const { isMuted, setMuted, muteDate, setMuteDate } = useContext(ChatDisplayContext);
    const { socket } = useContext(MessageContext);
    const { isRedirection, setRedirection, targetRedirection, setTargetRedirection, setCurrentConv } = useContext(ChatDisplayContext);
    const [ input, setInput ] = useState<string>("");
    const [ remainingTime, setRemainingTime ] = useState<number>(0);

    const actualize_input = (event: any) => {
      setInput(event.target.value);
    };

    const createConv = async () => {
      let createdId : string | null = null;

      await api
        .post("/dm/create", {targetId: targetRedirection.toString()})
        .then((res) => {
          setRedirection(false);
          setTargetRedirection("");
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

    useEffect( () => {
      if (isChannel && data){
        let channel : IChannel = (data as IDatas).data;

        if (channel) {
          let mute = channel.muted?.find( (muted) => muted.user.id == user?.id);
          if (mute){
            setMuted(true);
            setMuteDate(mute.end);
          }
        }
      }
    }, [data])

    useEffect( () => {
      if (muteDate){
        const released : Date = new Date(muteDate);

        let time = released.getTime() - Date.now();
        const interval = setInterval(() => {
          if (time <= 0){
            setMuted(false);
            setMuteDate(null);
            return;
          }
          setRemainingTime(time);
          time = time - 1000;
        }, 1000)

        return () => clearInterval(interval);
      }
    }, [muteDate])

    useEffect( () => {
      setMuted(false);
      setMuteDate(null);
    }, [isRedirection])

    const displayMinutesSeconds = (remainingTime : number) => {
      const minutes = Math.trunc((remainingTime / 1000) / 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      return (`${minutes}:${('0' + seconds).slice(-2)}`)
    }

    return (
      <form onSubmit={sendMessage}>
        <input
          className="input__form"
          type="text"
          placeholder={isMuted ? 
            muteDate ? `unmute in   ${displayMinutesSeconds(remainingTime)}` : "you're muted. Shushh." :
            "add message..."}
          value={input}
          onChange={actualize_input}
          disabled={isMuted}
        />
        { isMuted ? 
        <SendIcon className="send__button disabled" /> :
        <SendIcon className="send__button" onClick={sendMessage} /> }
      </form>
    );
  }

  export default SendMessageForm;